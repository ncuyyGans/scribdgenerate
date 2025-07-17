document.addEventListener('DOMContentLoaded', function() {
    const scribdLinkInput = document.getElementById('scribdLinkInput');
    const generateButton = document.getElementById('generateButton');
    const resultArea = document.getElementById('resultArea');
    const generatedLinkOutput = document.getElementById('generatedLinkOutput');
    const openNewTabButton = document.getElementById('openNewTabButton');

    generateButton.addEventListener('click', function() {
        const originalLink = scribdLinkInput.value.trim(); // Ambil nilai input dan hapus spasi di awal/akhir
        const regex = /\/document\/(\d+)\//; // Regular expression untuk mencari angka setelah /document/
        const match = originalLink.match(regex);

        if (match && match[1]) {
            const documentId = match[1];
            const embedLink = `https://id.scribd.com/embeds/${documentId}/content`;
            
            generatedLinkOutput.textContent = embedLink;
            resultArea.style.display = 'block'; // Tampilkan area hasil
            openNewTabButton.onclick = function() {
                window.open(embedLink, '_blank'); // Buka link di tab baru
            };
        } else {
            generatedLinkOutput.textContent = 'Link Scribd tidak valid. Pastikan formatnya seperti https://id.scribd.com/document/[ID_DOKUMEN]/[NAMA_DOKUMEN]';
            generatedLinkOutput.style.color = 'red';
            resultArea.style.display = 'block'; // Tetap tampilkan area hasil untuk pesan error
            openNewTabButton.style.display = 'none'; // Sembunyikan tombol jika link tidak valid
        }
    });
});