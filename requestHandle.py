from App import QuranDatabase
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, HTTPServer
import mimetypes
from os import path
from urllib.parse import urlparse, parse_qs
import webbrowser
import shutil
from views import index, aSurah, audioVarse



class myResponce(BaseHTTPRequestHandler, QuranDatabase):
    def do_GET(self):
        if(self.path == "/"):
            self.send_htmlHeader(mimetypes.guess_type("file.html"))
            index(self.wfile)
        elif(self.path.startswith("/publics")):
            self.handlePublics()
        elif self.path.startswith("/viewsurah"):
            prop = parse_qs(urlparse(self.path).query)
            self.send_htmlHeader(mimetypes.guess_type("file.html"))
            aSurah(self.wfile, prop["id"][0])
        elif self.path.startswith("/audio"):
            prop = parse_qs(urlparse(self.path).query)
            self.send_htmlHeader(mimetypes.guess_type("file.mp3"))
            self.wfile.write(audioVarse(int(prop["id"][0]), int(prop["varse"][0])))
        elif self.path == "/surah_names":
            # self.database = QuranDatabase()
            self.send_htmlHeader(mimetypes.guess_type("index.json"))
            self.wfile.write(self.getSurahNames().encode("utf-8"))
        elif self.path.startswith("/surah_names"):
            # self.database = QuranDatabase()
            prop = parse_qs(urlparse(self.path).query)
            self.send_htmlHeader(mimetypes.guess_type("index.json"))
            self.wfile.write(self.getSurahName(prop["id"][0]).encode("utf-8"))
        elif self.path.startswith("/quran"):
            prop = parse_qs(urlparse(self.path).query)
            self.send_htmlHeader(mimetypes.guess_type("index.txt"))
            if "varse" in prop:
                self.wfile.write(self.getAvarse(prop["id"][0], prop["varse"][0]).encode("utf-8"))
            else :
                self.wfile.write(self.getAvarse(prop["id"][0]).encode("utf-8"))

        else:
            self.send_not_found()
    def send_htmlHeader(self, mime):
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-type", mime)
        self.end_headers()
    def send_not_found(self):
        self.send_response(HTTPStatus.NOT_FOUND)
        self.send_header("Content-type", mimetypes.guess_type("file.html"))
        self.end_headers()
        self.wfile.write("404 NOT_FOUND".encode("utf-8"))
    def handlePublics(self):
        if path.exists("."+self.path):
            self.send_htmlHeader(mimetypes.guess_type(self.path))
            with open("."+self.path, "br") as file:
                shutil.copyfileobj(file, self.wfile)
        else:
            print("Not Found: "+self.path)
            self.send_not_found()

if __name__ == "__main__":
    with HTTPServer(("", 8000), myResponce) as htts:
        webbrowser.open("http://127.0.0.1:8000")
        htts.serve_forever()