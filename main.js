window.onload = function() {
    let tapeData = {
        tapeInfo: { Name: "My New Mixtape", Length: 60, Type: 1 },
        trackList: { sideA: {}, sideB: {} }
    };

    loadTapeData();

    function loadTapeData() {
        document.getElementById("tapeName").value = tapeData.tapeInfo.Name;
        document.getElementById("tapeLength").value = tapeData.tapeInfo.Length;
        document.getElementById("tapeType").value = tapeData.tapeInfo.Type;

        loadTrackList("sideA");
        loadTrackList("sideB");
    }

    function loadTrackList(side) {
        let tableBody = document.getElementById(`${side}Table`).querySelector("tbody");
        tableBody.innerHTML = "";

        let tracks = tapeData.trackList[side];
        let trackKeys = Object.keys(tracks);

        if (trackKeys.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>No tracks added yet</td></tr>";
            return;
        }

        trackKeys.forEach((trackKey, index) => {
            let track = tracks[trackKey];
            let row = tableBody.insertRow();

            row.innerHTML = `
                <td>${index + 1}</td>
                <td><input type="text" value="${track.title}" data-side="${side}" data-key="${trackKey}" class="trackTitle"></td>
                <td><input type="text" value="${track.artist}" data-side="${side}" data-key="${trackKey}" class="trackArtist"></td>
                <td><input type="number" value="${track.length}" data-side="${side}" data-key="${trackKey}" class="trackLength"></td>
                <td><button onclick="removeTrack('${side}', '${trackKey}')">❌</button></td>
            `;
        });

        document.querySelectorAll(`.trackTitle, .trackArtist, .trackLength`).forEach(input => {
            input.addEventListener("input", (e) => {
                let side = e.target.dataset.side;
                let key = e.target.dataset.key;
                let field = e.target.classList.contains("trackTitle") ? "title" :
                            e.target.classList.contains("trackArtist") ? "artist" : "length";

                tapeData.trackList[side][key][field] = e.target.value;
            });
        });
    }

    function addTrack(side) {
        let trackNum = Object.keys(tapeData.trackList[side]).length + 1;
        let trackKey = `track${trackNum}`;

        tapeData.trackList[side][trackKey] = { title: "", artist: "", length: 0 };
        loadTrackList(side);
    }

    function removeTrack(side, trackKey) {
        delete tapeData.trackList[side][trackKey];
        loadTrackList(side);
    }

    function saveCassette() {
        tapeData.tapeInfo.Name = document.getElementById("tapeName").value;
        tapeData.tapeInfo.Length = parseInt(document.getElementById("tapeLength").value);
        tapeData.tapeInfo.Type = parseInt(document.getElementById("tapeType").value);

        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tapeData, null, 2));
        let downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", tapeData.tapeInfo.Name.replace(/\s+/g, "_") + ".json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }

    function printJCard() {
        window.print();
    }

    // Make functions available globally
    window.addTrack = addTrack;
    window.removeTrack = removeTrack;
    window.saveCassette = saveCassette;
    window.printJCard = printJCard;
};