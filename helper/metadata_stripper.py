from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TXXX
import os
import shutil


def strip_metadata(input_file, debug=False):
    """
    Reads an MP3 file, displays all metadata, removes all metadata tags,
    and saves the file back.
    
    Args:
        input_file: Path to the MP3 file
        debug: If True, saves as DEBUG_originalname.mp3 instead of overwriting
    """
    if not os.path.exists(input_file):
        print(f"ERROR: File not found: {input_file}")
        return
    
    # Resolve the absolute path of the input file (using realpath to resolve symlinks)
    abs_input_file = os.path.realpath(input_file)
    
    if debug:
        print(f"Processing: {input_file} (DEBUG MODE)")
    else:
        print(f"Processing: {input_file}")
    
    try:
        # Load the MP3 file
        audio = MP3(abs_input_file, ID3=ID3)
        
        # Check if file has ID3 tags
        if audio.tags is None:
            print(f"  No metadata tags found in {input_file}")
            return
        
        # Display all metadata
        print(f"  All metadata tags in {input_file}:")
        for key in sorted(audio.tags.keys()):
            frame = audio.tags[key]
            # Format the value(s) from the frame
            if hasattr(frame, 'text'):
                # For text frames, join multiple values if present
                value = ', '.join(frame.text) if isinstance(frame.text, list) else str(frame.text)
            elif hasattr(frame, 'data'):
                value = str(frame.data)
            else:
                value = str(frame)
            
            # Truncate value to max 256 characters
            if len(value) > 256:
                value = value[:256] + "..."
            
            # For TXXX frames, also show the description
            if key.startswith('TXXX') and hasattr(frame, 'desc'):
                print(f"    {key}: {frame.desc} = {value}")
            else:
                print(f"    {key}: {value}")
        print()  # Empty line for readability
        
        # Determine output filename first
        if debug:
            # Get directory and filename using absolute path
            dir_path = os.path.dirname(abs_input_file)
            filename = os.path.basename(abs_input_file)
            output_file = os.path.normpath(os.path.join(dir_path, f"DEBUG_{filename}"))
            # Ensure directory exists
            if not os.path.exists(dir_path):
                print(f"  ERROR: Directory does not exist: {dir_path}")
                return
            print(f"  Debug mode: will save as {output_file}")
            # Copy the file first, then we'll modify the copy
            shutil.copy2(abs_input_file, output_file)
            # Load the copied file to modify its metadata
            audio = MP3(output_file, ID3=ID3)
        else:
            output_file = abs_input_file
        
        # Remove all metadata tags
        if audio.tags is None:
            print(f"  No metadata tags to remove in {output_file}")
            return
            
        tags_to_remove = list(audio.tags.keys())
        
        if tags_to_remove:
            print(f"  Removing {len(tags_to_remove)} metadata tag(s):")
            for key in tags_to_remove:
                print(f"    - {key}")
            
            # Remove all tags
            for key in tags_to_remove:
                del audio.tags[key]
            
            # Save the file with updated metadata
            audio.save(output_file)
            print(f"  ✓ Removed all metadata and saved: {output_file}")
        else:
            print(f"  No metadata tags to remove in {output_file}")
            
    except Exception as e:
        print(f"ERROR processing {input_file}: {str(e)}")


if __name__ == "__main__":
    input_directory = "../audio/"
    DEBUG_MODE = False
    
    # Process all MP3 files in the directory
    if not os.path.exists(input_directory):
        print(f"ERROR: Directory not found: {input_directory}")
        exit(1)
    
    mp3_files = [f for f in os.listdir(input_directory) if f.lower().endswith('.mp3')]
    
    if not mp3_files:
        print(f"No MP3 files found in {input_directory}")
        exit(0)
    
    print(f"Found {len(mp3_files)} MP3 file(s) in {input_directory}\n")
    
    for filename in mp3_files:
        # Skip files with "DEBUG" in the filename
        if "DEBUG" in filename:
            print(f"Skipping {filename} (contains 'DEBUG' in filename)\n")
            continue
        
        file_path = os.path.join(input_directory, filename)
        strip_metadata(file_path, debug=DEBUG_MODE)
        print()  # Empty line between files

