import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

neon_mapping = {
    'React.js': '#00f3ff',
    'Node.js': '#a78bfa',
    'PostgreSQL': '#a78bfa',
    'MongoDB': '#a78bfa',
    'Python': '#00f3ff',
    'JavaScript': '#00f3ff',
    'HTML5': '#00f3ff',
    'CSS3': '#00f3ff',
    'SQL': '#a78bfa',
    'RAG / AI': '#a78bfa',
    'Git': '#00f3ff',
    'GitHub': '#00f3ff',
    'VS Code': '#00f3ff',
}

accent_skills = [
    'ERP Systems', 'Cargo Management', 'AI Chatbots', 'Retrieval-Augmented Generation',
    'Full-Stack Architecture', 'Database Design', 'REST APIs', 'Dashboard UIs', 'Real-Time Systems'
]
for skill in accent_skills:
    neon_mapping[skill] = '#00f3ff'

def replace_svg(match):
    content = match.group(0)
    skill_name_match = re.search(r'</svg>\s*(.+?)</span>', content, re.DOTALL)
    if skill_name_match:
        skill_name = skill_name_match.group(1).strip()
        color = neon_mapping.get(skill_name, '#00f3ff')
        
        content = re.sub(r'<svg class="skill-icon"', f'<svg class="skill-icon" style="color: {color}"', content)
        content = re.sub(r'stroke="#[0-9a-fA-F]+"', 'stroke="currentColor"', content)
        content = re.sub(r'fill="#[0-9a-fA-F]+"', 'fill="currentColor"', content)
        
    return content

new_html = re.sub(r'<span class="skill-chip.*?</span>', replace_svg, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
