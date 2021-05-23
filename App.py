import sqlite3
import json
# db = sqlite3.connect("asset/databases/wordbyword.db")
# db.row_factory = sqlite3.Row
# c = db.cursor()
# # c.execute("Select name from sqlite_master Where type = 'table'")
# c.execute("Select * from quran Where surah_id = 1")
# # c.execute("Select sql from surah_name")
# print(json.dumps([dict(x) for x in c.fetchall()], ensure_ascii=False))
# db.close()

class QuranDatabase():
    quranDb = "asset/databases/quranWithTafsir.db"
    def getSurahNames(self):
        self.__enter__()
        self.cur.execute("Select * from surah_name")
        data = [dict(row) for row in self.cur.fetchall()]
        self.__exit__()
        return json.dumps(data, ensure_ascii=False)
    def getSurahName(self, id):
        self.__enter__()
        self.cur.execute("Select * from surah_name Where surah_no = ?",[id])
        data = [dict(row) for row in self.cur.fetchall()]
        self.__exit__()
        return json.dumps(data, ensure_ascii=False)
    def getAvarse(self, surahId, varseNo=None):
        self.__enter__()
        if varseNo != None:
            self.cur.execute("Select * from quran Where surah_id = ? And verse_id = ?", [surahId, varseNo])
        else:
            self.cur.execute("Select * from quran Where surah_id = ?",[surahId])
        data = [dict(row) for row in self.cur.fetchall()]
        self.__exit__()
        return json.dumps(data, ensure_ascii=False)
    def __enter__(self):
        self.db = sqlite3.connect(self.quranDb)
        self.db.row_factory = sqlite3.Row
        self.cur = self.db.cursor()
    def __exit__(self):
        self.cur.close()
        self.db.close()

if __name__ == "__main__":
    g = QuranDatabase()
    x = g.getAvarse("1", "2")
    print(x)