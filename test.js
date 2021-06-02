function mywork()
{
    return new Promise((resolve, reject)=>{
        console.log("working...");
        setTimeout(()=>{
            resolve("worked");
        }, 1200);
    })
}

mywork().then(ret=>{
    console.log(ret);
});