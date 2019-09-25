/*
        .-"-.
       /|6 6|\
      {/(_0_)\}
       _/ ^ \_
      (/ /^\ \)-'
       ""' '""
*/


function EolDialogsXBlock(runtime, element, settings) {
    var $ = window.jQuery;
    var $element = $(element);
    var buttonSubmit = $element.find('.submit');
    var subFeedback = $element.find('.submission-feedback');
    var statusDiv = $element.find('.status');
    var handlerUrlSaveStudentAnswers = runtime.handlerUrl(element, 'savestudentanswers');
    var handlerUrlShowAnswers = runtime.handlerUrl(element, 'getanswers');

    function updateText(result) {
        //actualizo el texto de correcto o incorrecto
        if(result.score >= 1){
            $element.find('.notificacion').html('');
            $element.find('.notificacion').removeClass('incorrecto');
            $element.find('.notificacion').addClass('correcto');
            $element.find('.notificacion.correcto').html('<img src="'+settings.image_path+'correct-icon.png"/> ¡Respuesta Correcta!');
        }
        else{
            $element.find('.notificacion').html('');
            $element.find('.notificacion').removeClass('correcto');
            $element.find('.notificacion').addClass('incorrecto');
            if(result.score > 0){
                $element.find('.notificacion.incorrecto').html('<img src="'+settings.image_path+'partial-icon.png"/> Respuesta parcialmente correcta');
            }
            else{
                $element.find('.notificacion.incorrecto').html('<img src="'+settings.image_path+'incorrect-icon.png"/> Respuesta Incorrecta');
            }
        }

        statusDiv.removeClass('correct');
        statusDiv.removeClass('incorrect');
        statusDiv.removeClass('unanswered');
        statusDiv.addClass(result.indicator_class);

        //desactivo el boton si es que se supero el nro de intentos
        if(result.max_attempts > 0){
            subFeedback.text('Has realizado '+result.attempts+' de '+result.max_attempts+' intentos');
            if(result.attempts >= result.max_attempts){
                buttonSubmit.attr("disabled", true);
            }
            else{
                buttonSubmit.attr("disabled", false);
            }
        }
        else{
            buttonSubmit.attr("disabled", false);
        }
        buttonSubmit.html("<span>" + buttonSubmit[0].dataset.value + "</span>");
    }

    function updateTextShowAnsers(result) {
        console.log("aaa");
        console.log(result.answers);
        var $obj = '';
        $obj = $('<html></html>');
        $obj.html('<b>Respuesta: </b>'+$element.find('.dialogo').html());
        $.each($obj.find(".inputdialogo"), function(j,v){
            $(v).replaceWith(result.answers[$(v).attr('question-id')]);
        })
        $.each($obj.find(".dropdowndialogo"), function(j,v){
            $(v).replaceWith(result.answers[$(v).attr('question-id')]);
        })
        $element.find('.the_answer').html($obj.html());
    }

    $(function ($) {

        findquestions($element.find('.dialogo'));
        clickSubmit();
        clickShowAnswers();
    });

    function clickSubmit(){
        buttonSubmit = $element.find('.submit');
        buttonSubmit.click(function(eventObject) {
            eventObject.preventDefault();
            var student_answers = {};
            $element.find('.inputdialogo').each(function() {
                student_answers[$(this).attr('question-id')] = $(this).val();
            });
            $element.find('.dropdowndialogo').each(function() {
                student_answers[$(this).attr('question-id')] = $(this).val();
            });
            $.ajax({
                type: "POST",
                url: handlerUrlSaveStudentAnswers,
                data: JSON.stringify({"student_answers": student_answers}),
                success: updateText
            });
        });
    }

    function clickShowAnswers(){
        buttonShowAnswers = $element.find('.button_show_answers');
        buttonShowAnswers.click(function(eventObject) {
            eventObject.preventDefault();
            $.ajax({
                type: "POST",
                url: handlerUrlShowAnswers,
                data: JSON.stringify({"holi": "holi"}),
                success: updateTextShowAnsers
            });
        });
    }
}
