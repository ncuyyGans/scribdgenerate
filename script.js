document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM elements =====
    const scribdLinkInput = document.getElementById('scribdLinkInput');
    const generateButton = document.getElementById('generateButton');
    const resultArea = document.getElementById('resultArea');
    const generatedLinkOutput = document.getElementById('generatedLinkOutput');
    const openNewTabButton = document.getElementById('openNewTabButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');
    const errorMessage = document.getElementById('errorMessage');
    const toast = document.getElementById('toast');
    const currentYear = document.getElementById('currentYear');

    // ===== State =====
    let currentEmbedLink = '';
    let toastTimer = null;

    // ===== Footer year =====
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ===== Toast notification =====
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toast.classList.remove('show');
        }, 2800);
    }

    // ===== Show / hide error =====
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        // Re-trigger shake animation
        errorMessage.style.animation = 'none';
        void errorMessage.offsetWidth;
        errorMessage.style.animation = '';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    // ===== Copy to clipboard =====
    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                // Fall through to legacy method
            }
        }
        // Legacy fallback
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '-9999px';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        } catch (err) {
            return false;
        }
    }

    // ===== Generate embed link =====
    function generateEmbedLink() {
        const originalLink = scribdLinkInput.value.trim();
        hideError();

        if (!originalLink) {
            showError('Mohon masukkan link dokumen Scribd terlebih dahulu.');
            scribdLinkInput.focus();
            return;
        }

        // Show loading state briefly for better UX feedback
        generateButton.classList.add('loading');
        generateButton.disabled = true;

        setTimeout(function() {
            generateButton.classList.remove('loading');
            generateButton.disabled = false;

            // Matches /document/<id> in any Scribd URL (supports id. / www. / m.)
            // Accepts trailing slash, query, hash, or end of string.
            const regex = /\/document\/(\d+)(?:\/|\?|#|$)/;
            const match = originalLink.match(regex);

            if (match && match[1]) {
                const documentId = match[1];
                currentEmbedLink = 'https://id.scribd.com/embeds/' + documentId + '/content';

                generatedLinkOutput.textContent = currentEmbedLink;
                generatedLinkOutput.style.color = '';
                resultArea.style.display = 'block';
                openNewTabButton.style.display = '';
                resetCopyButton();
                showToast('✅ Link embed berhasil dibuat!');
            } else {
                // Invalid format — show error inside result area
                currentEmbedLink = '';
                generatedLinkOutput.textContent = 'Link Scribd tidak valid. Pastikan formatnya seperti https://id.scribd.com/document/[ID_DOKUMEN]/[NAMA_DOKUMEN]';
                generatedLinkOutput.style.color = '#ef4444';
                resultArea.style.display = 'block';
                openNewTabButton.style.display = 'none';
                copyButton.style.display = 'none';
                showError('Format link tidak dikenali. Periksa kembali link Anda.');
            }
        }, 450);
    }

    // ===== Reset copy button state =====
    function resetCopyButton() {
        copyButton.style.display = '';
        copyButton.classList.remove('copied');
        copyButton.querySelector('.copy-text').textContent = 'Salin';
    }

    // ===== Event listeners =====
    generateButton.addEventListener('click', generateEmbedLink);

    scribdLinkInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateEmbedLink();
        }
    });

    // Show/hide clear button based on input content
    scribdLinkInput.addEventListener('input', function() {
        clearButton.style.display = this.value.trim() ? 'grid' : 'none';
    });

    clearButton.addEventListener('click', function() {
        scribdLinkInput.value = '';
        clearButton.style.display = 'none';
        hideError();
        resultArea.style.display = 'none';
        scribdLinkInput.focus();
    });

    openNewTabButton.addEventListener('click', function() {
        if (currentEmbedLink) {
            window.open(currentEmbedLink, '_blank', 'noopener,noreferrer');
        }
    });

    copyButton.addEventListener('click', async function() {
        if (!currentEmbedLink) return;

        const success = await copyToClipboard(currentEmbedLink);

        if (success) {
            copyButton.classList.add('copied');
            copyButton.querySelector('.copy-text').textContent = 'Tersalin';
            showToast('📋 Link berhasil disalin ke clipboard!');
            setTimeout(resetCopyButton, 2000);
        } else {
            showToast('⚠️ Gagal menyalin. Silakan salin secara manual.');
        }
    });
});