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

    var difficulty = "easy";
    var queryURL = "https://opentdb.com/api.php?amount=1&difficulty="+ difficulty +"&type=multiple";
    
    // Ajex call to queryURL
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
            console.log(tempClass + "   " + tempArr[i]);
        }

        var temp = "#a" + randomSet[3];
        $(temp).text(response.results[0].correct_answer).css("color","red");

    });

    $(".btn").on("click", function(){
        if(this.id===String("b"+randomSet[3])) console.log("victoryyyyyyyyy");
    });

})