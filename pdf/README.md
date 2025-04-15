# PDF Conversion System

This directory contains tools for converting the Cepheus Engine SRD PDF into structured Markdown files.

## Prerequisites

1. Python 3.8 or higher
2. Tesseract OCR (for handling scanned PDFs)
3. Poppler (for PDF processing)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Tesseract OCR:
- Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
- Linux: `sudo apt-get install tesseract-ocr`
- macOS: `brew install tesseract`

3. Install Poppler:
- Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases/
- Linux: `sudo apt-get install poppler-utils`
- macOS: `brew install poppler`

## Usage

1. Place the Cepheus Engine SRD PDF in this directory as `Cepheus_SRD.pdf`

2. Run the conversion script:
```bash
python pdf_to_markdown.py
```

This will:
1. Extract text from the PDF
2. Organize content into sections
3. Create markdown files in the `../rules/` directory

## Directory Structure

The converted rules will be organized into:
- `../rules/core/` - Basic game mechanics and concepts
- `../rules/character/` - Character creation and development
- `../rules/skills/` - Skills and skill checks
- `../rules/combat/` - Combat rules and mechanics
- `../rules/trade/` - Trade and commerce rules
- `../rules/space/` - Space travel and ship operations 