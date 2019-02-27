
$(document).ready(function() {
    //$(".btn-primary").addClass("hidden");
    var randomSet = [0,1,2,3];

    /***********Borrowed from stack overflow solutions********/
    /**/    function shuffleArray(array) {
    /**/         for (let i = array.length - 1; i > 0; i--) {
    /**/             const j = Math.floor(Math.random() * (i + 1));
    /**/            [array[i], array[j]] = [array[j], array[i]];
    /**/        }
    /**/    }
    /*********************************************************/

    var wins = 0;
    var losses = 0;
    var skips = 3;
    var points = 0;
    var difficulty = "easy";
    var canPlay = true;
    var round = 0;
    var styleColor = "";
    var time;

    function timer(){
        
        var timeleft = 10;
        time = setInterval(function(){
            $(".timeLeft").text("Time left: " + timeleft);
            timeleft -= 1;
            if(timeleft < 0){
                $("#play").prop("disabled", false);
                canPlay = true;
                clearInterval(time);
                if(styleColor === "green") points-=1;
                if(styleColor === "yellow") points-=2;
                if(styleColor === "red") points-=3;
                $(".gameControl").removeClass("panel-success");
                $(".gameControl").removeClass("panel-warning");
                $(".gameControl").addClass("panel-danger");
                $(".gameMessages").text("Round " + round + ": You've run out of time!");
                refreshData();
            }
        }, 1000);
    }

    function reset(){
        clearInterval(time);

        $(".gameControl").removeClass("panel-danger");
        $(".gameControl").removeClass("panel-warning");
        $(".gameControl").addClass("panel-success");
        $(".gameMessages").text("Round 0: Game Reset");

        $("#play").prop("disabled", false);
        $("#skip").prop("disabled", false);
        $(".question").empty();
        $("#a0,#a1,#a2,#a3").empty();

        wins = 0;
        losses = 0;
        skips = 3;
        points = 0;
        difficulty = "easy";
        canPlay = true;
        round = 0;
        styleColor = "";
        time;
        refreshData();
    }

    function refreshData(){
        $(".timeLeft").text("Time left: ");
        $("#ws").text(wins);
        $("#ls").text(losses);
        $("#points").text(points);
        $("#curdif").text(difficulty).css("color",styleColor);
        $("#skip").text("Skip (" + skips + ")");
        //answered = false;
    }

    function generateQuiz(){
        difficulty = $("#records").val();
        if(difficulty==="easy") { styleColor= "green"; }
        if(difficulty==="medium") { styleColor= "orange"; }
        if(difficulty==="hard") { styleColor= "red"; }

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
            }

            var temp = "#a" + randomSet[3];
            $(temp).text(response.results[0].correct_answer);

        });
    }

    $("#play").on("click", function(){

        if(canPlay && round < 10){

            timer();
            round++;
            $(".gameMessages").text("Round " + round + " started!");
            generateQuiz();
            refreshData();
            canPlay = false;
            $("#play").prop("disabled", true);
            $(".gameControl").addClass("panel-success");
            $(".gameControl").removeClass("panel-danger");
            $(".gameControl").removeClass("panel-warning");
            

        }

        else if(canPlay && round >= 10){
            $(".gameControl").addClass("panel-success");
            $(".gameControl").removeClass("panel-danger");
            $(".gameControl").removeClass("panel-warning");
            $(".gameMessages").text("You've completed all 10 rounds for a final score of " + points + "!");
        }

        else $(".gameMessages").text("Round " + round + ": You're already playing!");   
    });

    $("#skip").on("click", function(){
        if(round >= 10){
            $(".gameControl").addClass("panel-success");
            $(".gameControl").removeClass("panel-danger");
            $(".gameControl").removeClass("panel-warning");
            $(".gameMessages").text("You've completed all 10 rounds for a final score of " + points + "!");
        }
        else if(skips>0 && canPlay === false && round<10){

            clearInterval(time);
            timer();
            skips--;
            generateQuiz();
            refreshData();
            canPlay = false;
            $("#play").prop("disabled", true);
            $(".gameControl").removeClass("panel-success");
            $(".gameControl").removeClass("panel-danger");
            $(".gameControl").addClass("panel-warning");
            $(".gameMessages").text("Round " + round + ": You have skipped a question. Skips left " + skips +".");
        }

        else if(skips>0 && canPlay === true){
            $(".gameControl").removeClass("panel-success");
            $(".gameControl").removeClass("panel-danger");
            $(".gameControl").addClass("panel-warning");
            $(".gameMessages").text("Round " + round + ": You have yet to start another turn, no need to waste skips!");

        }
        else {
            $(".gameControl").removeClass("panel-success");
            $(".gameControl").removeClass("panel-warning");
            $(".gameControl").addClass("panel-danger");
            $(".gameMessages").text("Round " + round + ": You're out of skips!");
            //console.log(""); 
            $("#skip").prop("disabled", true);
        }
    });

    $("#reset").on("click", function(){

        reset();
    });

    $(".btn-primary").on("click", function(){
        
        
        if(this.id===String("b"+randomSet[3]) && canPlay===false) {
            $(this).text("Correct!").css("background-color","lightgreen");
            wins++;
            if(difficulty==="easy") { points += 1; }
            if(difficulty==="medium") { points += 2; }
            if(difficulty==="hard") { points += 3; }
            
            canPlay = true;
            clearInterval(time);

            $("#play").prop("disabled", false);
            
            $(".gameControl").removeClass("panel-info");
            $(".gameControl").removeClass("panel-warning");
            $(".gameControl").addClass("panel-success");
            $(".gameMessages").text("Round " + round + ": Correct!");
            refreshData();
            
        }

        else if(this.id!==String("b"+randomSet[3]) && canPlay===false) {
            $(this).text("Incorrect!").css("background-color","red");
            losses++;
            if(difficulty==="easy") { points -= 1; styleColor= "green";}
            if(difficulty==="medium") { points -= 2; styleColor= "yellow";}
            if(difficulty==="hard") { points -= 3; styleColor= "red";}
            
            canPlay = true;
            clearInterval(time);
            $("#play").prop("disabled", false);
            
            $(".gameControl").removeClass("panel-success");
            $(".gameControl").removeClass("panel-info");
            $(".gameControl").addClass("panel-warning");

            var temp = "#a" + randomSet[3];
            //$(temp).text(response.results[0].correct_answer);
            $(".gameMessages").text("Round " + round + ": Incorrect! The answer was " + $(temp).text());
            refreshData();
        }

    });

})