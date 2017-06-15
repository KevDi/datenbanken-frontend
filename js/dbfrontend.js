/**
 * Created by thomas on 12.06.2017.
 */

const SERVER = 'http://10.0.107.102:8081'
var showMovies = true;
var addMovie = true;
var table;

$(document).ready(function () {
    // Add smooth scrolling to all links in navbar + footer link
    $(".navbar a, footer a[href='#mongoDemo']").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {

            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 900, function () {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if


    });
    $.fn.dataTable.ext.errMode = 'none';

    //Suche initialisieren
    ladeSuche();

    //Default Add-Container laden
    $('#add_person_container').hide();
    $('#add_movie_container').show();
    addMovie=true;
    
    //Tag-Felder initialisiern und Farbe ändern
    $('#genres').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });
    $('#tags').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });
    $('#change_genres').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });
    $('#change_tags').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });

    $('#search').on('keyup click', function () {
        updateSearch();
    });

    
    //Listener für die Filme/Personen Radio Buttons
    $("input[name='options']").change(function () {
        if (this.value === 'filme') {
            clickFilme()
        }
        else if (this.value === 'personen') {
            clickPersonen()
        }
    });

    $("input[name='options2']").change(function () {
        if (this.value === 'filme') {
            clickFilme()
        }
        else if (this.value === 'personen') {
            clickPersonen()
        }
    });

    // Hinzufügen Listener der RBs
    $("input[name='options3']").change(function () {
        if (this.value === 'filme') {
            $('#add_person_container').hide();
            $('#add_movie_container').show();
            addMovie=true;
        }
        else if (this.value === 'personen') {
            $('#add_person_container').show();
            $('#add_movie_container').hide();
            addMovie=false
        }
    });
    
    //Click Listener für den Abbrechen Button des Bearbeiten Containers
    $('#change_movies_abort').click(function () {
        $('#placeholder').show();
        $('#change_container').hide();
    })
})

$(window).scroll(function () {
    $(".slideanim").each(function () {
        var pos = $(this).offset().top

        var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
            $(this).addClass("slide");
        }
    });
});

function updateSearch() {
    $('#suchergebnis').DataTable().search(
        $('#search').val(),
        false, true
    ).draw();
}


// Radio Button Group - Funktionen für Auswahl Filme/Personen
function clickFilme() {
    showMovies = true;
    $('#option2_1').prop("checked", true);
    $('#option2_1').parent().addClass("active");
    $('#option2_2').parent().removeClass("active");
    $('#option1').prop("checked", true);
    $('#option1').parent().addClass("active");
    $('#option2').parent().removeClass("active");
    $('#suchergebnis').DataTable().destroy();
    $('#suchergebnis tbody').empty();
    ladeSuche();
}

function clickPersonen() {
    showMovies = false;
    $('#option2_2').prop("checked", true);
    $('#option2_2').parent().addClass("active");
    $('#option2_1').parent().removeClass("active");
    $('#option2').prop("checked", true);
    $('#option2').parent().addClass("active");
    $('#option1').parent().removeClass("active");
    $('#suchergebnis').DataTable().destroy();
    $('#suchergebnis tbody').empty();
    ladeSuche();
}

function ladeSuche() {
    var adress = SERVER;
    if (showMovies) {
        adress = SERVER+'/v1/movies';
    } else {
        adress = SERVER+'/v1/persons';
    }

    table = $('#suchergebnis').DataTable({
        ajax: {
            dataSrc: function (json) {
                var return_data = new Array();
                for (var i = 0; i < json.length; i++) {
                    return_data.push({
                        name: json[i].name,
                        genres: json[i].genres,
                        year: "<center>" + json[i].year + "</center>",
                        rating: "<center>" + json[i].rating.toFixed(2) + "</center>",
                        action: "<center><button type=\"button\" class=\"btn btn-success btn-xs\">Bearbeiten</button> <button type=\"button\" class=\"btn btn-danger btn-xs\">Löschen</button></center>",
                        id: json[i].id,
                        tags: json[i].tags
                    })
                }
                return return_data;
            },
            url: adress,
            type: 'GET'
        },
        createdRow: function (row, data, index) {//
            var elems = $(row), $parent = elems.parent();

            // ID und Tags ausblenden; Sind aber weiterhin über Suche zu finden
            elems.find('td').eq(5).attr('style', 'display:none;');
            elems.find('td').eq(6).attr('style', 'display:none;');
        },
        columns: [
            {data: 'name', width: '40%'},
            {data: 'genres', width: '25%'},
            {data: 'year', width: '10%'},
            {data: 'rating', width: '10%'},
            {data: 'action', width: '15%'},
            {data: 'id', width: '0%'},
            {data: 'tags', width: '0%'}
        ],
        "language": {"url": "language/German.json"}
    });

    $('#suchergebnis tbody').on('click', 'button:contains(Löschen)', function () {
        var table = $('#suchergebnis').DataTable();
        var rowdata = table.row($(this).parents('tr')).data();

        if (confirm('Möchtest du ' + rowdata.name + ' aus der Datenbank entfernen?')) {
            //Todo Ajax-Call um den Film aus der DB zu löschen
        }
    });

    $('#suchergebnis tbody').on('click', 'button:contains(Bearbeiten)', function () {
        var table = $('#suchergebnis').DataTable();
        var rowdata = table.row($(this).parents('tr')).data();

        $('#change_movie_container').trigger("reset");
        $('#change_person_container').trigger("reset");

        $('#placeholder').hide();
        $('#change_container').show();

        if(showMovies){
            $('#change_movie_container').show();
            $('#change_person_container').hide();

            $('#change_titel').val(rowdata.name);
            trigger_event_handler('#change_titel');

            rowdata.year=rowdata.year.replace('<center>','');
            rowdata.year=rowdata.year.replace('</center>','');
            $('#change_year').val(rowdata.year);
            trigger_event_handler('#change_year');

            rowdata.rating=rowdata.rating.replace('<center>','');
            rowdata.rating=rowdata.rating.replace('</center>','');
            $('#change_rating').val(rowdata.rating);
            trigger_event_handler('#change_rating');

            $('#change_genres').tagsinput('removeAll');
            $.each( rowdata.genres, function( index, value ){
                $('#change_genres').tagsinput('add', value);
            });
            trigger_event_handler('#change_genres');

            $('#change_tags').tagsinput('removeAll');
            $.each( rowdata.tags, function( index, value ){
                $('#change_tags').tagsinput('add', value);
            });
            trigger_event_handler('#change_tags');

        }else{
            $('#change_movie_container').hide();
            $('#change_person_container').show();
        }



        window.location.hash ="#bearbeiten"
        //Todo Bearbeiten Formular mit Film/Personendaten füllen
    });

    $( "#add_movie_container" ).submit(function( event ) {
        //Todo PUT-Ajax-Call für Movies schreiben
    });

    $( "#add_person_container" ).submit(function( event ) {
        //Todo PUT-Ajax-Call für Personen schreiben
    });

    $( "#change_movie_container" ).submit(function( event ) {
        //Todo PUT-Ajax-Call für Movies schreiben
    });

    $( "#change_person_container" ).submit(function( event ) {
        //Todo PUT-Ajax-Call für Personen schreiben
    });
}


function trigger_event_handler(item) {
    $(function () {
        $(item).focus();
        $(item).keydown();
        $(item).keypress();
        $(item).keyup();
        $(item).blur();
        $(item).change();
    });
}



