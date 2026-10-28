(function () {
    var box = document.getElementById('compare');
    if (!box) return;

    var buttons = document.querySelectorAll('[data-split]');
    var dragging = false;

    function clamp(n) {
        return Math.max(8, Math.min(92, n));
    }

    function setSplit(n) {
        var value = clamp(n);
        box.style.setProperty('--split', value + '%');
        buttons.forEach(function (btn) {
            btn.classList.toggle('is-on', Number(btn.getAttribute('data-split')) === Math.round(value));
        });
    }

    function fromEvent(event) {
        var point = event.touches ? event.touches[0] : event;
        var rect = box.getBoundingClientRect();
        return ((point.clientX - rect.left) / rect.width) * 100;
    }

    function start(event) {
        dragging = true;
        setSplit(fromEvent(event));
    }

    function move(event) {
        if (!dragging) return;
        if (event.cancelable) event.preventDefault();
        setSplit(fromEvent(event));
    }

    function stop() {
        dragging = false;
    }

    box.addEventListener('mousedown', start);
    box.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setSplit(Number(btn.getAttribute('data-split')));
        });
    });

    window.addEventListener('keydown', function (event) {
        var now = parseFloat(getComputedStyle(box).getPropertyValue('--split')) || 50;
        if (event.key === 'ArrowLeft') setSplit(now - 6);
        if (event.key === 'ArrowRight') setSplit(now + 6);
    });
})();
