$(document).ready(function() {
    var randomSet = [0,1,2,3];

    /***********Borrowed from stack overflow solutions********/
    /**/    function shuffleArray(array) {
    /**/         for (let i = array.length - 1; i > 0; i--) {
    /**/             const j = Math.floor(Math.random() * (i + 1));
    /**/            [array[i], array[j]] = [array[j], array[i]];
    /**/        }
    /**/    }
    /*********************************************************/

    //var difficulty = "easy";
    var wins = 0;
    var losses = 0;
    var skips = 3;
    var points = 0;
    var difficulty = "easy";
    
    //var numDocs = parseInt($("#records").val());
    generateQuiz();
    // Ajex call to queryURL
    function generateQuiz(){
        difficulty = $("#records").val();
        //console.log(difficulty);
        var queryURL = "https://opentdb.com/api.php?amount=1&difficulty="+ difficulty +"&type=multiple";
        $(".question").empty();
        $(".answer").empty();
        $(".btn").text("Select answer").css("background-color", "#337ab7");
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            var tempArr = response.results[0].incorrect_answers;
            shuffleArray(randomSet);
            $(".question").text(response.results[0].question);

            for(var i = 0; i<3; i++){
                var tempClass = "#a" + randomSet[i];
                $(tempClass).text(tempArr[i]);
                //console.log(tempClass + "   " + tempArr[i]);
            }

            var temp = "#a" + randomSet[3];
            $(temp).text(response.results[0].correct_answer);

        });
    }

    $(".btn").on("click", function(){
        if(this.id===String("b"+randomSet[3])) {
            $(this).text("Correct!").css("background-color","lightgreen");
            wins++;
            if(difficulty==="easy") points += 1;
            if(difficulty==="medium") points += 2;
            if(difficulty==="hard") points += 3;

            generateQuiz();
            $("#ws").text(wins);
            $("#points").text(points);
            $("#curdif").text(difficulty);
        }
        
        else if(this.id!==String("b"+randomSet[3])) {
            $(this).text("Incorrect!").css("background-color","red");
            losses++;
            if(difficulty==="easy") points -= 1;
            if(difficulty==="medium") points -= 2;
            if(difficulty==="hard") points -= 3;

            generateQuiz();
            $("#ls").text(losses);
            $("#points").text(points);
            $("#curdif").text(difficulty);
        }

    });

})