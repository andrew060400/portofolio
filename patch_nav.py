import re

with open('src/views/AlibabaClone.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update .nav-container
content = content.replace('.nav-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 40px;\n}',
                          '.nav-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 40px;\n  position: relative;\n}')

# 2. Update .nav-links a hovering
content = content.replace('.nav-links a {\n  font-size: 14px;\n  color: var(--ali-dark);\n  font-weight: 500;\n  position: relative;\n}',
                          '.nav-links > a,\n.nav-links > .ta-dropdown-wrapper > a {\n  font-size: 14px;\n  color: var(--ali-dark);\n  font-weight: 500;\n  position: relative;\n  text-decoration: none;\n}')
content = content.replace('.nav-links a:hover {\n  color: var(--ali-orange);\n}',
                          '.nav-links > a:hover,\n.nav-links > .ta-dropdown-wrapper > a:hover {\n  color: var(--ali-orange);\n}')
content = content.replace('.nav-links a.active {\n  color: var(--ali-orange);\n}',
                          '.nav-links > a.active,\n.nav-links > .ta-dropdown-wrapper > a.active {\n  color: var(--ali-orange);\n}')
content = content.replace('.nav-links a.active::after {\n  content: \'\';\n  position: absolute;\n  bottom: -10px;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  background-color: var(--ali-orange);\n}',
                          '.nav-links > a.active::after,\n.nav-links > .ta-dropdown-wrapper > a.active::after {\n  content: \'\';\n  position: absolute;\n  bottom: -10px;\n  left: 0;\n  width: 100%;\n  height: 2px;\n  background-color: var(--ali-orange);\n}')

# 3. Update mega menu dropping
ta_wrapper_old = """.ta-dropdown-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}"""
ta_wrapper_new = """.ta-dropdown-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}"""
content = content.replace(ta_wrapper_old, ta_wrapper_new)

ta_content_old = """.ta-content {
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
}"""
ta_content_new = """.ta-content {
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
}"""
content = content.replace(ta_content_old, ta_content_new)

# 4. Duplicate the HTML for all links
# we will extract the exact chunk
import re
dropdown_html = ""
m = re.search(r'(<div class="ta-dropdown-wrapper">\s*<a href="#">Trade Assurance</a>\s*<div class="ta-content">.*?</div>\s*</div>)', content, re.DOTALL)
if m:
    dropdown_html = m.group(1)

if dropdown_html:
    nav_links_html_new = f"""            <div class="ta-dropdown-wrapper">
              <a href="#" class="active">Ready to Ship</a>
              {dropdown_html.split('<div class="ta-content">', 1)[1].split('</div>\\n            </div>')[0]}</div>
            </div>
            <div class="ta-dropdown-wrapper">
              <a href="#">Personalized Design</a>
              {dropdown_html.split('<div class="ta-content">', 1)[1].split('</div>\\n            </div>')[0]}</div>
            </div>
            {dropdown_html}
            <div class="ta-dropdown-wrapper">
              <a href="#">Buyer Central</a>
              {dropdown_html.split('<div class="ta-content">', 1)[1].split('</div>\\n            </div>')[0]}</div>
            </div>
            <div class="ta-dropdown-wrapper">
              <a href="#">Help Center</a>
              {dropdown_html.split('<div class="ta-content">', 1)[1].split('</div>\\n            </div>')[0]}</div>
            </div>"""
    
    # regex sub out the original links area
    original = re.search(r'<a href="#" class="active">Ready to Ship</a>.*?<a href="#">Help Center</a>', content, re.DOTALL)
    if original:
        content = content.replace(original.group(0), nav_links_html_new)
    else:
        print("Could not find the original nav links block")

with open('src/views/AlibabaClone.vue', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done patching.")
