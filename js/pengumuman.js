// FITUR COUNTDOWN JAM 14:00
function startCountdown() {
    var now = new Date();
    var targetTime = new Date();
    targetTime.setHours(15, 0, 0, 0); // Set ke jam 14:00:00

    if (now >= targetTime) {
        document.getElementById("countdown-section").style.display = "none";
        document.getElementById("index-form").style.display = "block";
        return;
    }

    var x = setInterval(function() {
        var currentTime = new Date().getTime();
        var distance = targetTime.getTime() - currentTime;

        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById("timer").innerHTML = hours + ":" + minutes + ":" + seconds;

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown-section").style.display = "none";
            document.getElementById("index-form").style.display = "block";
        }
    }, 1000);
}

window.onload = function() {
    startCountdown();
};

// FITUR CEK KELULUSAN
function sendData() {
    document.getElementById('index-form-alert').style.display = 'none';
    var nomor = document.getElementById("index-form-registration-number").value.trim();
    var err = '';
    
    if (nomor == '') {
        err = 'Nomor pendaftaran tidak boleh kosong';
    }

    if (err != '') {
        document.getElementById('index-form-alert').innerHTML = err;
        document.getElementById('index-form-alert').style.display = 'block';
        return false;
    } else {
        $.ajax({
            type: 'GET',
            url: 'json/hasil.json', 
            dataType: 'json',
            success: function(result) {
                if(result) {
                    var size = result.length;
                    if(size > 0){
                        // Cari data langsung menggunakan nomor pendaftaran
                        let id = _.find(result, ["no_peserta", ""+ nomor +""]);
                        if(typeof id != "undefined") {
                            if (id["diterima"] == '1') {
                                accepted(id);
                            } else if (id["diterima"] == '0') {
                                rejected(id);
                            }
                        } else {
                            document.getElementById('index-form-alert').innerHTML = 'Nomor pendaftaran tidak ditemukan';
                            document.getElementById('index-form-alert').style.display = 'block';
                        }
                    }
                }
            },
            error: function() {
                document.getElementById('index-form-alert').innerHTML = 'Gagal mengakses data (Pastikan file hasil.json ada/URL benar)';
                document.getElementById('index-form-alert').style.display = 'block';
            }
        });	
    }
}

function rejected(data) {
    var tmpl =
        '<div id="index-rejected" class="index-rejected" style="width: 90%; margin: 0 auto; box-sizing: border-box;">' +
        '<div class="index-rejected-header">' +
        '<div class="header-title">' +
        '<h1 class="index-rejected-header-title-text" style="font-size: clamp(1.2rem, 4vw, 1.5rem);">MOHON MAAF, ANDA DINYATAKAN TIDAK LULUS SELEKSI ADMIN</h1>' +
        '<span class="index-rejected-header-title-sub">TETAP SEMANGAT DAN JANGAN MENYERAH. TERUS TINGKATKAN KEMAMPUAN ANDA.</span>' +
        ' </div>' +
        '</div>' +
        '<div class="index-rejected-content">' +
        '<div class="index-rejected-content-upper" style="margin-bottom: 0;">' +
        '<div class="index-rejected-content-upper-bio">' +
        '<span class="index-rejected-content-upper-bio-nisn" id="index-rejected-nisn">NO DAFTAR : ' + data["no_peserta"] + '</span>' +
        '<span class="index-rejected-content-upper-bio-name" id="index-rejected-name" style="font-size: clamp(1.5rem, 5vw, 2.5rem); word-break: break-word;">' + data["nama"] + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    document.getElementById('index').innerHTML = tmpl;
}

function accepted(data) {
    var tmpl =
        '<div id="index-accepted" class="index-accepted" style="width: 90%; margin: 0 auto; box-sizing: border-box;">' +
        '<div class="index-accepted-header">' +
        '<div class="index-accepted-header-title">' +
        '<h1 class="index-accepted-header-title-text" style="font-size: clamp(1.2rem, 4vw, 1.5rem);">SELAMAT! ANDA DINYATAKAN LULUS SEBAGAI ADMIN DAILY STUDY</h1>' +
        '</div>' +
        '</div>' +
        '<div class="index-accepted-content">' +
        '<div class="index-accepted-content-upper">' +
        '<div class="index-accepted-content-upper-bio">' +
        `<span class="index-accepted-content-upper-bio-nisn" id="index-accepted-nisn">` + ` NOMOR PENDAFTARAN: ` + data["no_peserta"] + `</span>` +
        '<span class="index-accepted-content-upper-bio-name" id="index-accepted-name" style="font-size: clamp(1.5rem, 5vw, 2.5rem); word-break: break-word;">' + data["nama"] + '</span>' +
        '<span class="index-accepted-content-upper-bio-program" id="index-accepted-program">Posisi: ' + data["posisi"] + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="index-accepted-content-lower" style="display: block;">' +
        '<div class="index-accepted-content-lower-column" style="width: 100%; padding: 0;">' +
        '<div class="index-accepted-content-lower-column-note" style="margin-top: 10px; text-align: left; width: 100%; box-sizing: border-box;">' +
        '<span class="index-accepted-content-lower-column-note-title">Silakan lakukan konfirmasi.</span>'+
        '<span class="index-accepted-content-lower-column-note-subtitle">Informasi onboarding dan pendaftaran ulang tim Admin dapat dihubungi melalui grup koordinasi.</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="index-accepted-footer">' +
        '<p class="index-accepted-footer-paragraph">Status penerimaan Anda sebagai admin ditetapkan setelah melengkapi berkas komitmen di panitia pusat Daily Study.</p>' +
        '</div>' +
        '</div>';
    document.getElementById('index').innerHTML = tmpl;
}