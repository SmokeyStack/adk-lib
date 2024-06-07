import shutil
import sys

if __name__ == "__main__":
    if len(sys.argv)-1 < 1:
        print("Too few arguments")
        exit(1)
    
    shutil.copyfile(f'data/{sys.argv[1]}.json', "BP/manifest.json")