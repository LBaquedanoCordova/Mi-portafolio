/**
 * Encargado de dividir cajas de texto en spans para animaciones
 */
export function splitText(selector, splitBy = 'words') {
    const parentElements = document.querySelectorAll(selector);

    parentElements.forEach(parent => {
        const text = parent.innerText;
        parent.innerHTML = '';
        parent.style.opacity = 1;
        parent.classList.add('split-text-container');

        if (splitBy === 'words') {
            const words = text.split(' ');
            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.classList.add('split-word');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';

                wordSpan.innerText = word;

                parent.appendChild(wordSpan);

                if (wordIndex < words.length - 1) {
                    const space = document.createTextNode(' ');
                    parent.appendChild(space);
                }
            });
        } else if (splitBy === 'chars') {
            const words = text.split(' ');
            words.forEach((word, wordIndex) => {
                const wordWrap = document.createElement('span');
                wordWrap.style.display = 'inline-block';
                wordWrap.style.whiteSpace = 'nowrap';

                const chars = word.split('');
                chars.forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.classList.add('split-char');
                    charSpan.style.display = 'inline-block';
                    charSpan.innerText = char;
                    wordWrap.appendChild(charSpan);
                });

                parent.appendChild(wordWrap);

                if (wordIndex < words.length - 1) {
                    const space = document.createTextNode(' ');
                    parent.appendChild(space);
                }
            });
        }
    });

    return parentElements;
}
