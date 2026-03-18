document.addEventListener("keydown", e => {
    if(e.key === "ArrowUp") {
        // Nutzername bekommt Fokus
        document.querySelector('input[name="username"]').focus();
        e.preventDefault();
    } else if (e.key === "ArrowDown") {
        // Passwort bekommt Fokus
        document.querySelector('input[name="password"]').focus();
        e.preventDefault();
    }
});