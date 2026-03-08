(function() {
    // ===== SETUP =====
    var c = document.getElementById('c');
    var a = c.getContext('2d');

    var O, Q; // width, height
    var v = 32; // jumlah trail & partikel per trail
    var M = Math;
    var R = M.random;
    var C = M.cos;
    var Y = 6.3; // 2*PI hampiran

    var e = []; // trails (array of particles)
    var h = []; // heart path nodes

    // Variabel untuk interaksi
    var mouseDown = false;
    var mouseX = 0, mouseY = 0;

    // ===== FUNGSI MENGHITUNG ULANG PATH HATI =====
    function computeHeartPath() {
        h = [];
        for (var i = 0; i < Y; i += 0.2) {
            h.push([
                O/2 + 180 * M.pow(M.sin(i), 3),
                Q/2 + 10 * (-(15*C(i) - 5*C(2*i) - 2*C(3*i) - C(4*i)))
            ]);
        }
    }

    // ===== RESIZE CANVAS =====
    function resizeCanvas() {
        O = c.width = window.innerWidth;
        Q = c.height = window.innerHeight;
        computeHeartPath();
        // Partikel tidak direset agar transisi tetap halus
    }

    // ===== INISIALISASI PARTIKEL =====
    function initParticles() {
        e = [];
        for (var i = 0; i < v; i++) {
            var x = R() * O;
            var y = R() * Q;

            // Warna berdasarkan hsl
            var H = i/v * 80 + 280;
            var S = R() * 40 + 60;
            var B = R() * 60 + 20;

            var f = []; // trail

            for (var k = 0; k < v; k++) {
                f[k] = {
                    x: x,
                    y: y,
                    X: 0,
                    Y: 0,
                    R: (1 - k/v) + 1,
                    S: R() + 1,
                    q: ~~(R() * v),
                    D: i % 2 * 2 - 1,
                    F: R() * 0.2 + 0.7,
                    f: "hsla(" + ~~H + "," + ~~S + "%," + ~~B + "%,.1)"
                };
            }

            e[i] = f;
        }
    }

    // ===== FUNGSI RENDER SATU PARTIKEL =====
    function renderParticle(p) {
        a.fillStyle = p.f;
        a.beginPath();
        a.arc(p.x, p.y, p.R, 0, Y, true);
        a.closePath();
        a.fill();
    }

    // ===== LOOP UTAMA =====
    function loop() {
        // Bersihkan canvas dengan efek trail
        a.fillStyle = "rgba(0,0,0,.2)";
        a.fillRect(0, 0, O, Q);

        // Loop setiap trail
        for (var i = 0; i < v; i++) {
            var trail = e[i];
            var u = trail[0]; // partikel terdepan

            // Tentukan target: jika mouse ditekan, arahkan ke posisi mouse, else ke node hati
            var targetX, targetY;
            if (mouseDown) {
                targetX = mouseX;
                targetY = mouseY;
            } else {
                targetX = h[u.q][0];
                targetY = h[u.q][1];
            }

            // Hitung jarak ke target
            var dx = u.x - targetX;
            var dy = u.y - targetY;
            var dist = M.sqrt(dx*dx + dy*dy);

            // Jika target adalah node hati dan jarak < threshold, pindah ke node berikutnya
            if (!mouseDown && dist < 10) {
                if (R() > 0.95) {
                    u.q = ~~(R() * v);
                } else {
                    if (R() > 0.99) u.D *= -1;
                    u.q += u.D;
                    u.q %= v;
                    if (u.q < 0) u.q += v;
                }
            }

            // Update kecepatan menuju target
            if (dist > 0.1) {
                u.X += (-dx / dist) * u.S;
                u.Y += (-dy / dist) * u.S;
            }

            // Terapkan kecepatan
            u.x += u.X;
            u.y += u.Y;

            // Gambar partikel terdepan
            renderParticle(u);

            // Terapkan friksi
            u.X *= u.F;
            u.Y *= u.F;

            // Update partikel ekor (trail)
            for (var k = 0; k < v - 1; k++) {
                var current = trail[k];
                var next = trail[k + 1];

                next.x -= (next.x - current.x) * 0.7;
                next.y -= (next.y - current.y) * 0.7;

                renderParticle(next);
            }
        }
    }

    // ===== ANIMASI LOOP =====
    function animate() {
        requestAnimationFrame(animate);
        loop();
    }

    // ===== EVENT HANDLER =====
    function updateMousePosition(e) {
        var rect = c.getBoundingClientRect();
        var scaleX = c.width / rect.width;   // jika ada CSS scaling
        var scaleY = c.height / rect.height;
        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;
        // clamp ke dalam canvas
        mouseX = M.min(M.max(mouseX, 0), O);
        mouseY = M.min(M.max(mouseY, 0), Q);
    }

    function updateTouchPosition(e) {
        if (e.touches.length > 0) {
            var touch = e.touches[0];
            var rect = c.getBoundingClientRect();
            var scaleX = c.width / rect.width;
            var scaleY = c.height / rect.height;
            mouseX = (touch.clientX - rect.left) * scaleX;
            mouseY = (touch.clientY - rect.top) * scaleY;
            mouseX = M.min(M.max(mouseX, 0), O);
            mouseY = M.min(M.max(mouseY, 0), Q);
        }
    }

    // Mouse events
    c.addEventListener('mousedown', function(e) {
        e.preventDefault();
        mouseDown = true;
        updateMousePosition(e);
    });

    window.addEventListener('mousemove', function(e) {
        if (mouseDown) {
            updateMousePosition(e);
        }
    });

    window.addEventListener('mouseup', function(e) {
        mouseDown = false;
    });

    // Touch events untuk HP
    c.addEventListener('touchstart', function(e) {
        e.preventDefault();
        mouseDown = true;
        updateTouchPosition(e);
    });

    c.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (mouseDown) {
            updateTouchPosition(e);
        }
    });

    c.addEventListener('touchend', function(e) {
        e.preventDefault();
        mouseDown = false;
    });

    c.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        mouseDown = false;
    });

    // Resize
    window.addEventListener('resize', function() {
        resizeCanvas();
    });

    // ===== MULAI =====
    resizeCanvas();      // set ukuran & hitung heart path
    initParticles();     // buat partikel
    animate();           // mulai animasi
})();