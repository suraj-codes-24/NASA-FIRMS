import os
import glob
import re

print("Starting replacement...")

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            if 'http://localhost:8000/api/v1' in new_content:
                print(f'Replacing in {filepath}')
                
                # We need to handle the import path for config.js dynamically based on folder depth
                depth = filepath.count(os.sep) - 2
                prefix = '../' * depth if depth > 0 else './'
                import_statement = f"import {{ API_BASE }} from '{prefix}config';"
                
                new_content = new_content.replace("const API_BASE = 'http://localhost:8000/api/v1';", import_statement)
                new_content = new_content.replace("baseURL: 'http://localhost:8000/api/v1',", f"baseURL: API_BASE,")
                
                if "import { API_BASE }" not in new_content and file == "api.js":
                    new_content = import_statement + "\n" + new_content

            if "http://localhost:8000/hotspots/trigger-ingestion" in new_content:
                print(f"Replacing trigger url in {filepath}")
                if "import { API_BASE }" not in new_content:
                    depth = filepath.count(os.sep) - 2
                    prefix = '../' * depth if depth > 0 else './'
                    new_content = f"import {{ API_BASE }} from '{prefix}config';\n" + new_content
                new_content = new_content.replace("'http://localhost:8000/hotspots/trigger-ingestion'", "`${API_BASE.replace('/api/v1', '')}/hotspots/trigger-ingestion`")

            if "import.meta.env.VITE_API_URL || 'http://localhost:8000'" in new_content and file != 'config.js':
                 print(f"Replacing base url in {filepath}")
                 new_content = new_content.replace("const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'", "import { API_BASE } from '../config';\nconst API_BASE_URL = API_BASE.replace('/api/v1', '');")

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
