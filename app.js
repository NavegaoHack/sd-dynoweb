
const reader = new FileReader
const parser = new DOMParser

let doc = null

function navigate() {
    const engineSection = doc.querySelector("section[name=Engine]")
    
    engineCapacity.innerText = engineSection.querySelector("attnum[name=capacity]").getAttribute("val")
    engineCilinders.innerText = engineSection.querySelector("attnum[name=cylinders]").getAttribute("val")
    engineShape.innerText = engineSection.querySelector("attstr[name=shape]").getAttribute("val")
    engineRevsLimiter.innerText = engineSection.querySelector("attnum[name='revs limiter']").getAttribute("val")

    const dataPoints = engineSection.querySelectorAll("section[name='data points'] section")
    let torques = []
    
    dataPoints.forEach(point => {
        torques.push(+point.querySelector("attnum[name=Tq]").getAttribute("val"))
    })
    const maxTq = Math.max(...torques)

    dataPoints.forEach(point => {
        pointInput = document.createElement("div")
        label = document.createElement("input")
        range = document.createElement("input")
        range.style.display = "block"
        range.type = "range"
        label.type = "number"
        range.min = 0
        range.max = maxTq
        range.value = +point.querySelector("attnum[name=Tq]").getAttribute("val")
        label.value = +point.querySelector("attnum[name=Tq]").getAttribute("val")
        pointInput.dataset.name = +point.getAttribute("name")
        pointInput.appendChild(range)
        pointInput.appendChild(label)

        enginePowerDataPoints.appendChild(pointInput)
    })
    enginePowerDataPoints.addEventListener("click", (e)=>{
        const newValue = e.target.value
        console.log(newValue)
        e.target.parentNode.querySelector("input[type=range]").value = newValue
        e.target.parentNode.querySelector("input[type=number]").value = newValue

        i = e.target.parentNode.dataset.name
        console.log(i)

        dataPoints[i - 1].querySelector("attnum[name=Tq]").setAttribute("val", newValue)

        console.log(engineSection)

    })
    downloadConfig.onclick = () => {
        downloadFile()
    }
}
function downloadFile(content) {
    const s = new XMLSerializer();
    const str = s.serializeToString(doc);
    const blob = new Blob([str], {type: "application/xml"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileSelector.files[0].name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

reader.onload = () => {
    doc = parser.parseFromString(reader.result, "application/xml")
    navigate()
}

fileSelector.addEventListener("change", e => {
    reader.readAsText(e.target.files[0])
})