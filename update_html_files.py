import os
import re
import sys

def update_html_files(batch_num, batch_size):
    all_files = []
    for root, _, files in os.walk("."):
        for file in files:
            if file.endswith(".html"):
                all_files.append(os.path.join(root, file))

    start_index = (batch_num - 1) * batch_size
    end_index = start_index + batch_size
    batch_files = all_files[start_index:end_index]

    if not batch_files:
        print("No more files to process.")
        return

    for filepath in batch_files:
        process_html_file(filepath)

def process_html_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    # Remove old stylesheet links
    content = re.sub(r'<link rel="stylesheet".*(global|-style)\.css">', '', content)
    # Remove inline styles
    content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
    # Remove inline scripts
    content = re.sub(r'<script>.*?(const lightModeBtn|DOMContentLoaded).*?</script>', '', content, flags=re.DOTALL)
    # Remove existing global.js script tags
    content = re.sub(r'<script src=".*?/assets/js/global.js"></script>', '', content)

    # Add new stylesheet links
    path_depth = filepath.count('/')
    if filepath.startswith('./'):
        path_depth -= 1
    prefix = "../" * path_depth

    new_head_links = f'<link rel="stylesheet" href="{prefix}assets/css/main.css">'
    if "mcq.html" in filepath:
        new_head_links += f'\n    <link rel="stylesheet" href="{prefix}assets/css/mcq-styles.css">'

    if '</title>' in content:
        content = re.sub(r'</title>', '</title>\n' + new_head_links, content)
    elif '</head>' in content:
        content = re.sub(r'</head>', new_head_links + '\n</head>', content)


    # Add new script tag
    content = re.sub(r'</body>', f'<script src="{prefix}assets/js/global.js"></script>\n</body>', content)

    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {filepath}")
    except Exception as e:
        print(f"Error writing to {filepath}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python update_html_files.py <batch_num> <batch_size>")
        sys.exit(1)

    batch_num = int(sys.argv[1])
    batch_size = int(sys.argv[2])
    update_html_files(batch_num, batch_size)
