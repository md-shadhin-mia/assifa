import shutil
import winsound


class surahView(object):
    def Rander(self, id):
        self.sura_id = id
        with open('surahview.html', encoding="utf-8") as tfile:
            self.data = tfile.read()
            self.template(["sura_id"])
            return self.data
    def template(self, props):
        for prop in props:
            self.data =self.data.replace("{{"+prop+"}}", str(eval("self."+prop)))


def index(file):
    with open('index.html', "rb") as tfile:
        shutil.copyfileobj(tfile, file)
    return
def aSurah(file, id=1):
    view = surahView()
    file.write(view.Rander(id).encode("utf-8"))
    return
def audioVarse(surahId, varseId):
    audioPath = "0"*(3-len(str(surahId)))+str(surahId)
    varsename = audioPath+("0"*(3-len(str(varseId)))+str(varseId))
    varsePath = "asset/audio/Alafasy/"+audioPath+"/"+varsename+".mp3"
    print(varsePath)
    with open(varsePath, "rb") as aud:
        return aud.read()
    return

# if __name__ == "__main__":
#     audio(1,1)