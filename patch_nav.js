const fs = require('fs');

let content = fs.readFileSync('src/views/AlibabaClone.vue', 'utf8');

// 1. Update .nav-container
content = content.replace(
    `.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}`,
    `.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  position: relative;
}`);

// 2. Update .nav-links a hovering
content = content.replace(
    `.nav-links a {
  font-size: 14px;
  color: var(--ali-dark);
  font-weight: 500;
  position: relative;
}`,
    `.nav-links > a,
.nav-links > .ta-dropdown-wrapper > a {
  font-size: 14px;
  color: var(--ali-dark);
  font-weight: 500;
  position: relative;
  text-decoration: none;
}`);

content = content.replace(
    `.nav-links a:hover {
  color: var(--ali-orange);
}`,
    `.nav-links > a:hover,
.nav-links > .ta-dropdown-wrapper > a:hover {
  color: var(--ali-orange);
}`);

content = content.replace(
    `.nav-links a.active {
  color: var(--ali-orange);
}`,
    `.nav-links > a.active,
.nav-links > .ta-dropdown-wrapper > a.active {
  color: var(--ali-orange);
}`);

content = content.replace(
    `.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--ali-orange);
}`,
    `.nav-links > a.active::after,
.nav-links > .ta-dropdown-wrapper > a.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--ali-orange);
}`);

// 3. Update mega menu dropping
content = content.replace(
    `.ta-dropdown-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}`,
    `.ta-dropdown-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}`);

content = content.replace(
    `.ta-content {
  position: absolute;
  top: 100%;
  left: -200px;
  width: 700px;
  display: flex;
  background: var(--ali-white);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  border: 1px solid var(--ali-border);
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  gap: 32px;
}`,
    `.ta-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  background: var(--ali-white);
  padding: 24px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  border: 1px solid var(--ali-border);
  border-top-color: transparent;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  gap: 32px;
}`);

// 4. Duplicate the HTML for all links
const regexMenu = /(<div class="ta-dropdown-wrapper">\s*<a href="#">Trade Assurance<\/a>\s*<div class="ta-content">[\s\S]*?<\/div>\s*<\/div>)/m;
const match = content.match(regexMenu);

if (match && match[0]) {
    const tradeAssuranceHTML = match[0];
    const taContentHTML = tradeAssuranceHTML.match(/<div class="ta-content">([\s\S]*?)<\/div>\s*<\/div>/m)[0]; // get the content block

    // Create the new nav links
    const newLinksHTML = `            <div class="ta-dropdown-wrapper">
              <a href="#" class="active">Ready to Ship</a>
              ${taContentHTML}
            <div class="ta-dropdown-wrapper">
              <a href="#">Personalized Design</a>
              ${taContentHTML}
            ${tradeAssuranceHTML}
            <div class="ta-dropdown-wrapper">
              <a href="#">Buyer Central</a>
              ${taContentHTML}
            <div class="ta-dropdown-wrapper">
              <a href="#">Help Center</a>
              ${taContentHTML}`;

    const linksRegex = /<a href="#" class="active">Ready to Ship<\/a>[\s\S]*?<a href="#">Help Center<\/a>/;
    content = content.replace(linksRegex, newLinksHTML);
} else {
    console.log("Could not find the original nav links block");
}

fs.writeFileSync('src/views/AlibabaClone.vue', content, 'utf8');
console.log("Done patching.");
