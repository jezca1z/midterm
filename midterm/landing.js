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

(function () {
    var dialog = document.getElementById('story-dialog');
    var cards = document.querySelectorAll('.location-card');
    if (!dialog || !cards.length) return;

    var title = document.getElementById('story-title');
    var kicker = document.getElementById('story-kicker');
    var description = document.getElementById('story-description');
    var front = document.getElementById('story-front');
    var back = document.getElementById('story-back');
    var frontCredit = document.getElementById('story-front-credit');
    var backCredit = document.getElementById('story-back-credit');

    function setCredit(container, card, side) {
        var prefix = 'data-' + side + '-';
        var source = document.createElement('a');
        source.href = card.getAttribute(prefix + 'source');
        source.target = '_blank';
        source.rel = 'noreferrer';
        source.textContent = card.getAttribute(prefix + 'author');

        var license = document.createElement('a');
        license.href = card.getAttribute(prefix + 'license-url');
        license.target = '_blank';
        license.rel = 'noreferrer';
        license.textContent = card.getAttribute(prefix + 'license');

        container.replaceChildren(
            document.createTextNode('Photo: '),
            source,
            document.createTextNode(' · '),
            license
        );
    }

    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            var place = card.getAttribute('data-place');
            title.textContent = place;
            kicker.textContent = 'BANGKOK / ' + card.getAttribute('data-english');
            description.textContent = card.getAttribute('data-story');
            front.src = card.getAttribute('data-front');
            front.alt = place + ' ในมุม Front';
            back.src = card.getAttribute('data-back');
            back.alt = place + ' ในมุม Back';
            setCredit(frontCredit, card, 'front');
            setCredit(backCredit, card, 'back');
            dialog.showModal();
        });
    });

    dialog.querySelector('.story-close').addEventListener('click', function () {
        dialog.close();
    });

    dialog.addEventListener('click', function (event) {
        if (event.target === dialog) dialog.close();
    });
})();
