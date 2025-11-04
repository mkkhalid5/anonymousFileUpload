const CLOUD_NAME = 'ddqhduwov'; // আপনার ক্লাউডিনারি cloud name লিখুন
const UPLOAD_PRESET = 'silent'; // unsigned upload_preset

const QR_CDN = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) return alert("Please select a file!");

    const file = fileInput.files[0];
    if (file.size > 4 * 1024 * 1024 * 1024) {
        alert("Maximum file size is 4GB!");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    let url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
    document.getElementById('linkBox').innerText = "Uploading...";

    let response = await fetch(url, { method: "POST", body: formData });
    let data = await response.json();

    if (data.secure_url) {
        let qrURL = QR_CDN + encodeURIComponent(data.secure_url);
        document.getElementById('linkBox').innerHTML = `
          <b>Download Link (7 days):</b>
          <br/>
          <input type="text" id="downloadLink" value="${data.secure_url}" style="width:80%;" readonly>
          <button onclick="copyLink()">Copy</button>
          <br/><br/>
          <img src="${qrURL}" alt="QR Code">
        `;
    } else {
        document.getElementById('linkBox').innerText = "Upload failed!";
    }
}

function copyLink() {
    let copyText = document.getElementById("downloadLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}
