document.addEventListener("DOMContentLoaded", function(event) {
    var modal = document.getElementById('myModal');
    var closeBtn = document.getElementsByClassName("close")[0];
    var html5QrCode;
  
    function closeModal() {
      html5QrCode.stop().then(() => {
        modal.style.display = "none";
      }).catch(err => console.error(err));
    }
  
    closeBtn.onclick = closeModal;
  
    window.onclick = function(event) {
      if (event.target == modal) {
        closeModal();
      }
    }
  
    // Add event listener to a parent element that exists when the page loads
    document.body.addEventListener("click", function(event) {
      if (event.target && event.target.id === "openScannerBtn") {
        modal.style.display = "block";
        html5QrCode = new Html5Qrcode("reader");
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
          closeModal();
          message(decodedText);
        };
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
        .catch(error => console.error(error));
      }
    });
  });