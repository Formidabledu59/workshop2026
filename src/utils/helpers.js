'use client'

export function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('fade-in');
    }
}

export function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('hidden');
        element.classList.remove('fade-in');
    }
}

export const selctTxt = (htmlElement) => {
    htmlElement.target.select();
}