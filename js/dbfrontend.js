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
    ladeFilmsuche();

    //Default Add-Container laden
    $('#add_person_container').hide();
    $('#add_movie_container').show();
    addMovie = true;

    //Tag-Felder initialisiern und Farbe ändern
    $('#genres').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });
    $('#tags').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });
    $('#languages').tagsinput({
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
    $('#change_languages').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });
    $('#change_movies').tagsinput({
        tagClass: 'label label-success',
        confirmKeys: [13, 44]
    });

    $('#searchbtn').on('click', function () {
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
            addMovie = true;
        }
        else if (this.value === 'personen') {
            $('#add_person_container').show();
            $('#add_movie_container').hide();
            addMovie = false
        }
    });

    //Click Listener für den Abbrechen Button des Bearbeiten Containers
    $('#change_movies_abort').click(function () {
        $('#placeholder').show();
        $('#change_container').hide();
    });

    //Click Listener für den Abbrechen Button des Bearbeiten Containers
    $('#change_persons_abort').click(function () {
        $('#placeholder').show();
        $('#change_container').hide();
    });
    // Hinzufügen - Filme
    $("#add_movie_container").submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        var json =JSON.stringify({
            name: $('#titel').val(),
            year: $('#year').val(),
            rating:  $('#rating').val(),
            tags: $('#tags').tagsinput('items'),
            genres: $('#genres').tagsinput('items'),
        });

        $.ajax({
            url: SERVER+"/v1/movies",
            contentType: 'application/json',
            type: 'POST',
            data:  json ,
            success: function (result) {
                if(showMovies){
                    table.ajax.reload();
                }
                $("#add_movie_container").trigger("reset");
                $('#tags').tagsinput('removeAll');
                $('#genres').tagsinput('removeAll');
                $("#success_label").empty();
                $('#success_label').append("Film wurde erfolgreich hinzugefügt!");
                $('#message_success').show();
                if ($('#message_success').length) {
                    setTimeout(function () {
                        $('#message_success').fadeOut('fast');
                    }, 1500); // <-- time in milliseconds
                }
                location.href="#ergebnis";
            },
            error: function (result) {
                showError();
            }
        });
    });
    // Hinzufügen - Personen
    $("#add_person_container").submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        var json =JSON.stringify({
            firstName: $('#firstname').val(),
            lastName: $('#lastname').val(),
            age:  $('#age').val(),
            languages: $('#languages').tagsinput('items'),
            country: $('#country').val(),
            gender: $('#gender').val(),
        });

        $.ajax({
            url: SERVER+"/v1/persons",
            contentType: 'application/json',
            type: 'POST',
            data:  json ,
            success: function (result) {
                if(!showMovies){
                    table.ajax.reload();
                }
                $("#add_person_container").trigger("reset");
                $('#languages').tagsinput("reset");
                location.href="#ergebnis";
                $("#success_label").empty();
                $('#success_label').append("Person wurde erfolgreich hinzugefügt!");
                $('#message_success').show();
                if ($('#message_success').length) {
                    setTimeout(function () {
                        $('#message_success').fadeOut('fast');
                    }, 1500); // <-- time in milliseconds
                }
            },
            error: function (result) {
                showError();
            }
        });
    });
    // Ändern - Filme
    $("#change_movie_container").submit(function (event) {
        event.preventDefault();

        var json =JSON.stringify({
            name: $('#change_titel').val(),
            year: $('#change_year').val(),
            rating:  $('#change_rating').val(),
            tags: $('#change_tags').tagsinput('items'),
            genres: $('#change_genres').tagsinput('items'),
        });

        $.ajax({
            url: SERVER+"/v1/movies/"+$('#movie_id').val(),
            contentType: 'application/json',
            type: 'PUT',
            data:  json ,
            success: function (result) {
                if(showMovies){
                    table.ajax.reload();
                }

                $('#placeholder').show();
                $('#change_container').hide();
                $("#success_label").empty();
                $('#success_label').append("Film wurde erfolgreich geändert!");
                $('#message_success').show();
                if ($('#message_success').length) {
                    setTimeout(function () {
                        $('#message_success').fadeOut('fast');
                    }, 1500); // <-- time in milliseconds
                }
                location.href="#ergebnis";
            },
            error: function (result) {
                showError();
            }
        });
    });
    // Ändern - Personen
    $("#change_person_container").submit(function (event) {
        /* stop form from submitting normally */
        event.preventDefault();

        var json =JSON.stringify({
            firstName: $('#change_firstname').val(),
            lastName: $('#change_lastname').val(),
            age:  $('#change_age').val(),
            languages: $('#change_languages').tagsinput('items'),
            country: $('#change_country').val(),
            gender: $('#change_gender').val()
        });

        $.ajax({
            url: SERVER+"/v1/persons/"+$('#person_id').val(),
            contentType: 'application/json',
            type: 'PUT',
            data:  json ,
            success: function (result) {
                if(!showMovies){
                    table.ajax.reload();
                }

                $('#placeholder').show();
                $('#change_container').hide();
                $("#success_label").empty();
                $('#success_label').append("Person wurde erfolgreich geändert!");
                $('#message_success').show();
                if ($('#message_success').length) {
                    setTimeout(function () {
                        $('#message_success').fadeOut('fast');
                    }, 1500); // <-- time in milliseconds
                }
                location.href="#ergebnis";

            },
            error: function (result) {
                showError();
            }
        });
    });


    if ($('#message_failed').length) {
        setTimeout(function () {
            $('#message_failed').fadeOut('fast');
        }, 3000); // <-- time in milliseconds
    }

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
    if (showMovies) {
        $('#suchergebnis').DataTable().search(
            $('#search').val(),
            false, true
        ).draw();
    } else {
        $('#suchergebnis_personen').DataTable().search(
            $('#search').val(),
            false, true
        ).draw();
    }

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
    removeDatatables();
    ladeFilmsuche();
}

function clickPersonen() {
    showMovies = false;
    $('#option2_2').prop("checked", true);
    $('#option2_2').parent().addClass("active");
    $('#option2_1').parent().removeClass("active");
    $('#option2').prop("checked", true);
    $('#option2').parent().addClass("active");
    $('#option1').parent().removeClass("active");

    removeDatatables();
    ladePersonensuche();
}

function ladeFilmsuche() {
    $('#suchergebnis').show();
    $('#suchergebnis_personen').hide();
    var adress = SERVER + '/v1/movies';

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

        var local_table = $('#suchergebnis').DataTable();
        var row = local_table.row($(this).parents('tr'));
        var rowdata = row.data();


        if (confirm('Möchtest du ' + rowdata.name + ' aus der Datenbank entfernen?')) {
            var adress = SERVER + "/v1/movies/" + rowdata.id;
            $.ajax({
                url: adress,
                type: 'DELETE',
                success: function (result) {
                    row.remove().draw(true);
                },
                error: function (result) {
                    alert("UPS... Da ist was schief gelaufen! Kontaktiere bitte den Admin!")
                }
            });
        }
    });

    $('#suchergebnis tbody').on('click', 'button:contains(Bearbeiten)', function () {
        var local_table = $('#suchergebnis').DataTable();
        var rowdata = local_table.row($(this).parents('tr')).data();

        $('#change_movie_container').trigger("reset");
        $('#change_person_container').trigger("reset");

        $('#placeholder').hide();
        $('#change_container').show();

        if (showMovies) {
            $('#change_movie_container').show();
            $('#change_person_container').hide();

            $('#movie_id').val(rowdata.id);
            trigger_event_handler('#movie_id');

            $('#change_titel').val(rowdata.name);
            trigger_event_handler('#change_titel');

            rowdata.year = rowdata.year.replace('<center>', '');
            rowdata.year = rowdata.year.replace('</center>', '');
            $('#change_year').val(rowdata.year);
            trigger_event_handler('#change_year');

            rowdata.rating = rowdata.rating.replace('<center>', '');
            rowdata.rating = rowdata.rating.replace('</center>', '');
            $('#change_rating').val(rowdata.rating);
            trigger_event_handler('#change_rating');

            $('#change_genres').tagsinput('removeAll');
            $.each(rowdata.genres, function (index, value) {
                $('#change_genres').tagsinput('add', value);
            });
            trigger_event_handler('#change_genres');

            $('#change_tags').tagsinput('removeAll');
            $.each(rowdata.tags, function (index, value) {
                $('#change_tags').tagsinput('add', value);
            });
            trigger_event_handler('#change_tags');

        } else {
            $('#change_movie_container').hide();
            $('#change_person_container').show();
        }


        window.location.hash = "#bearbeiten"
    });
}

function ladePersonensuche() {
    $('#suchergebnis').hide();
    $('#suchergebnis_personen').show();
    var adress = SERVER + '/v1/persons';

    table = $('#suchergebnis_personen').DataTable({
        ajax: {
            dataSrc: function (json) {
                var return_data = new Array();
                for (var i = 0; i < json.length; i++) {
                    return_data.push({
                        firstName: json[i].firstName,
                        lastName: json[i].lastName,
                        age: "<center>" + json[i].age + "</center>",
                        gender: json[i].gender,
                        country: json[i].country,
                        languages: json[i].languages,
                        action: "<center><button type=\"button\" class=\"btn btn-success btn-xs\">Bearbeiten</button> <button type=\"button\" class=\"btn btn-danger btn-xs\">Löschen</button></center>",
                        id: json[i].id,
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
            elems.find('td').eq(7).attr('style', 'display:none;');
        },
        columns: [
            {data: 'lastName', width: '20%'},
            {data: 'firstName', width: '20%'},
            {data: 'age', width: '10%'},
            {data: 'gender', width: '10%'},
            {data: 'country', width: '10%'},
            {data: 'languages', width: '15%'},
            {data: 'action', width: '15%'},
            {data: 'id', width: '0%'}
        ],
        "language": {"url": "language/German.json"}
    });

    $('#suchergebnis_personen tbody').on('click', 'button:contains(Löschen)', function () {
        var local_table = $('#suchergebnis_personen').DataTable();
        var row = local_table.row($(this).parents('tr'));
        var rowdata = row.data();

        if (confirm('Möchtest du ' + rowdata.lastName + " " + rowdata.firstName + ' aus der Datenbank entfernen?')) {
            var adress = SERVER + "/v1/persons/" + rowdata.id;
            $.ajax({
                url: adress,
                type: 'DELETE',
                success: function (result) {
                    row.remove().draw();
                },
                error: function (result) {
                    alert("UPS... Da ist was schief gelaufen! Kontaktiere bitte den Admin!")
                }
            });

        }
    });

    $('#suchergebnis_personen tbody').on('click', 'button:contains(Bearbeiten)', function () {
        var local_table = $('#suchergebnis_personen').DataTable();
        var rowdata = local_table.row($(this).parents('tr')).data();

        $('#change_movie_container').trigger("reset");
        $('#change_person_container').trigger("reset");

        $('#placeholder').hide();
        $('#change_container').show();

        if (!showMovies) {
            $('#change_movie_container').hide();
            $('#change_person_container').show();

            $('#person_id').val(rowdata.id);
            trigger_event_handler('#person_id');

            $('#change_firstname').val(rowdata.firstName);
            trigger_event_handler('#change_firstname');

            $('#change_lastname').val(rowdata.lastName);
            trigger_event_handler('#change_lastname');

            rowdata.age = rowdata.age.replace('<center>', '');
            rowdata.age = rowdata.age.replace('</center>', '');
            $('#change_age').val(rowdata.age);
            trigger_event_handler('#change_age');

            $('#change_gender').val(rowdata.gender);
            trigger_event_handler('#change_gender');

            $('#change_country').val(rowdata.country);
            trigger_event_handler('#change_country');

            $('#change_languages').tagsinput('removeAll');
            $.each(rowdata.languages, function (index, value) {
                $('#change_languages').tagsinput('add', value);
            });
            trigger_event_handler('#change_languages');

            $('#change_movies').tagsinput('removeAll');
            var movies=[];
                $.getJSON(adress+"/"+rowdata.firstName+"-"+rowdata.lastName+"/movies",function(data) {
                if (data != null) {
                    var returnValue=[];
                    $.each(data, function(key, value) {
                            movies.push(value.name);

                    });
                    $.each(movies, function (index, value) {
                        $('#change_movies').tagsinput('add', value);
                    });
                    trigger_event_handler('#change_movies');
                }
            });

        } else {
            $('#change_movie_container').hide();
            $('#change_person_container').show();
        }


        window.location.hash = "#bearbeiten"
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

function removeDatatables() {
    $('#suchergebnis tbody').prop('onclick', null).off('click');
    $('#suchergebnis').DataTable().destroy();
    $('#suchergebnis tbody').empty();
    $('#suchergebnis_personen tbody').prop('onclick', null).off('click');
    $('#suchergebnis_personen').DataTable().destroy();
    $('#suchergebnis_personen tbody').empty();

}

function showError() {
    $("#failed_label").empty();
    $('#failed_label').append("Da ist was schief gelaufen! Kontaktiere den Admin!");
    $('#message_failed').show();
    if ($('#message_failed').length) {
        setTimeout(function () {
            $('#message_failed').fadeOut('fast');
        }, 1500); // <-- time in milliseconds
    }
}


