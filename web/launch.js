$(document).ready(function () {
    window.localStorage.setItem('changed', false);

    $('ul li').each(function (index, value) {
        let element = $(value);
        if (window.localStorage.getItem(element.attr('id')) !== '') {
            element.next().attr('src', 'https://www.google.com/s2/favicons?domain=' + window.localStorage.getItem(element.attr('id'))).addClass('fav');
        }
        $('#' + element.attr('id')).click(function (params) {
            
        })
    })
    $('#setting').addClass('wait');

    let data;
    $.get('data', function (rawData) {
        data = JSON.parse(rawData);
        for (let index in data) {
            $('#' + index).next().attr('src', '').removeClass('fav');
            window.localStorage.setItem(index, data[index]);
            $('#' + index).click(function () {
                if ($('#setting>img').attr('src') === 'save.png') {
                    let data_index = $('#link').attr('data');//use data_index to store the prev-key`s index, we should save the value when we press another key. The following is  init. the input box, then we save value when input box unfocus.(see line 26)
                    $('#link').css('display', 'block').attr('data', index);
                    $('#link>input').val(window.localStorage.getItem(index));
                    $('#link>input').attr('placeholder', 'The target for "' + this.innerText + '"');
                    $('#link>input').focus();
                } else if (data[index] !== '') {
                    $(this).addClass('keyDownLi');
                    $(this).parent().addClass('keyDownSpan');
                    window.location = 'http://' + data[index];
                }
            })
            if (data[index] !== '') {
                $('#' + index + '+img').attr('src', 'https://www.google.com/s2/favicons?domain=' + data[index]).addClass('fav');
            }
        }
        $('#setting').removeClass('wait');
    })

    $('#link>input').blur(function () {
        let data_index = $('#link').attr('data');
        let value = $('#link>input').val().replace(/http[s]?:\/\//, '');
        if (window.localStorage.getItem(data_index) !== value) {
            window.localStorage.setItem(data_index, value);
            window.localStorage.setItem('changed', true);
        }
        if (value !== '') {
            $('#' + data_index + '+img').attr('src', 'https://www.google.com/s2/favicons?domain=' + value).addClass('fav');
        } else {
            $('#' + data_index + '+img').attr('src', '').removeClass('fav');
        }
        $('#link>input').val('');
        $('#link>input').attr('placeholder', 'The target for "' + $('#' + data_index).text() + '"');
    })

    $('#setting>img').click(function () {
        if ($('#setting').hasClass('wait')) {
            return;
        }
        if ($('#setting>img').attr('src') === 'setting.png') {
            $('#setting>img').attr('src', 'save.png');
            $('#token').css('display', 'block');
        } else {
            $('#setting>img').attr('src', 'setting.png');
            $('#token').css('display', 'none');
            $('#link').css('display', 'none');
            $('#token').val('');
            $.ajax({
                type: "POST",
                url: "data",
                data: {
                    md5: (function () {
                        let date = new Date();
                        return md5($('#token').val() + date.getUTCDate() + date.getUTCHours() + date.getUTCMinutes())
                    })(),
                    data: (function () {
                        for (let index in data) {
                            data[index] = window.localStorage.getItem(index);
                        }
                        return JSON.stringify(data);
                    })()
                },
                success: function () { },
                dataType: "json"
            });
        }
    })

    var isKeydown = false;

    $(document).keydown(function (event) {
        if (!isKeydown && $('#' + event.which + '+img').attr('src') !== '') {
            console.log(event.which);
            $('#' + event.which).addClass('keyDownLi');
            $('#' + event.which).parent().addClass('keyDownSpan');
            setTimeout(function () { $('#' + event.which).removeClass('keyDownLi') }, 80);
            setTimeout(function () { $('#' + event.which).parent().removeClass('keyDownSpan') }, 80);
            $('#' + event.which).click();
            isKeydown = true;
        }
    })
})