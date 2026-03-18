// Toast-Messege
let popup = document.querySelector("#message");
if(popup) {
    // Popup nach 5 sek löschen
    setTimeout(() => {
        popup.remove();
    }, 3000);
}