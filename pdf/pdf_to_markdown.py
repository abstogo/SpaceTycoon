import os
import re
from pathlib import Path
from PyPDF2 import PdfReader
import markdown
from typing import List, Dict

class PDFConverter:
    def __init__(self, pdf_path: str, output_dir: str):
        self.pdf_path = pdf_path
        self.output_dir = output_dir
        self.reader = PdfReader(pdf_path)
        self.sections = {
            'core': [],
            'character': [],
            'skills': [],
            'combat': [],
            'trade': [],
            'space': []
        }
    
    def clean_text(self, text: str) -> str:
        """Clean up extracted text"""
        # Remove page headers and footers
        text = re.sub(r'Cepheus Engine SRD\s+\d+\s+Samardan Pre?ss', '', text)
        text = re.sub(r'Tanaël Ghazarian \(order #\d+\)', '', text)
        
        # Fix multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Fix line breaks
        text = re.sub(r'(?<=[a-z])\s*\n\s*(?=[a-z])', ' ', text)
        
        # Remove duplicate spaces around punctuation
        text = re.sub(r'\s+([.,;:!?])', r'\1', text)
        
        return text.strip()
        
    def extract_text(self) -> str:
        """Extract text from PDF"""
        text = ""
        for page in self.reader.pages:
            page_text = page.extract_text()
            text += self.clean_text(page_text) + "\n\n"
        return text
    
    def organize_content(self, text: str) -> Dict[str, List[str]]:
        """Organize content into sections based on headers"""
        # Define section headers and their corresponding categories
        section_patterns = {
            'core': r'(?i)(?:introduction|basic rules|game concepts)',
            'character': r'(?i)(?:character creation|character development|characteristics)',
            'skills': r'(?i)(?:skills|skill checks|skill list)',
            'combat': r'(?i)(?:combat|weapons|armor|fighting)',
            'trade': r'(?i)(?:trade|commerce|economics|market)',
            'space': r'(?i)(?:space travel|starships|space combat|jump drive)'
        }
        
        # Split text into sections
        current_section = 'core'
        sections = {k: [] for k in self.sections.keys()}
        
        paragraphs = text.split('\n\n')
        for para in paragraphs:
            # Check if paragraph matches any section header
            for section, pattern in section_patterns.items():
                if re.search(pattern, para):
                    current_section = section
                    break
            
            # Add paragraph to current section if it's not empty
            if para.strip():
                sections[current_section].append(para.strip())
        
        return sections
    
    def create_markdown(self, sections: Dict[str, List[str]]) -> None:
        """Create markdown files for each section"""
        # Create output directory structure
        for section in sections.keys():
            os.makedirs(os.path.join(self.output_dir, section), exist_ok=True)
        
        # Create markdown files
        for section, content in sections.items():
            if content:
                output_path = os.path.join(self.output_dir, section, f"{section}.md")
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(f"# {section.title()} Rules\n\n")
                    f.write('\n\n'.join(content))
    
    def convert(self):
        """Main conversion process"""
        print("Extracting text from PDF...")
        text = self.extract_text()
        
        print("Organizing content into sections...")
        sections = self.organize_content(text)
        
        print("Creating markdown files...")
        self.create_markdown(sections)
        
        print("Conversion complete!")

if __name__ == "__main__":
    # Create output directory
    output_dir = os.path.join("..", "rules")
    os.makedirs(output_dir, exist_ok=True)
    
    # Convert PDF
    converter = PDFConverter("Cepheus_SRD.pdf", output_dir)
    converter.convert() 