import re
class Templetes(object):
    def getPropaty(self, content):
        propaty = re.findall(r"\{\s*([a-z]+)\s*\}", content)[0]
        return re.sub(r"{.*}", str(self.__dict__[propaty]), content)
    def separet(self, content):
        if(re.match(r"\{.*\}", content) != None):
            return self.getPropaty(content)
        else:
            return ""
    def templting(self, uri):
        with open(uri+".sha.html") as temp:
            data = temp.read()
        lowerbound = []
        uperbound = []
        pos = data.find("{")
        while pos > 0 :
            lowerbound.append(pos)
            t = 0
            p = int(pos)+1
            while(True):
                if data.find("{", p) > 0 and data.find("{", p) < data.find("}", p):
                    t+=1
                    p = data.find("{", p)+1
                elif data.find("}", p) > 0:
                    p = data.find("}", p)+1
                    if(t <= 0):
                        uperbound.append(p)
                        break
                    else:
                        t-=1
                else:
                    print("errors")
                    break
            pos = data.find("{", p)
            willrep = []
            repwith = []
        for l, u in zip(lowerbound, uperbound):
            willrep.append(data[l:u])
            repwith.append(data[l+1:u+1])
        for l, u in zip(willrep, repwith):
            data = data.replace(l, self.separet(u))
        return data