window.addEventListener('scroll', function() {
    const header = document.getElementById('top-header')
    if (window.scrollY === 0) {
        header.classList.remove('fixed')
    } else {
        header.classList.add('fixed')
    }
})