// Scroll Variables
var windowWidth;
var windowHeight;
var scrollableHeight;
var currentScrollTop;
var previousScrollTop;
var percentageScrolled;

// General Variables
var directionOp;
var trainDirection;
var directionNum;
var rotateValue;
var countValue = 5693851;
var valueString;
var currentCountValue;

// jQuery Variables
var $body;
var $introScreen;
var $scrollInfoSpan;
var $grass;
var $sky;
var $ground;
var $train;
var $wheels;
var $wheelContainers;
var $mountains;
var $allTrees;
var $treesBack;
var $treesFront;
var $trainTrack;
var $auschwitz;
var $bergenBelsen;
var $countBox;
var $infographics;
var $exitScreen;
var $rainDrops;

$(document).ready(function() {
	// jQuery Variables
	$body = $("body");
	$introScreen = $("#introScreen");
	$scrollInfoSpan = $("#scrollInfo");
	$grass = $("#grass");
	$sky = $("#sky");
	$ground = $("#ground");
	$train = $("#fullTrain");
	$wheels = $(".wheel");
	$wheelContainers = $(".wheelContainer");
	$mountains = $("img[class*='mount']");
	$allTrees = $(".tree");
	$treesBack = $(".treesBack");
	$treesFront = $(".treesFront");
	$trainTrack = $("#trainTrack");
	$auschwitz = $(".auschwitz");
	$bergenBelsen = $("#bergenBelsen");
	$countBox = $("#countBox");
	$infographics = $("#infographics");
	$exitScreen = $("#exitScreen");
	
	// Window Dimensions
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	resetLengthOfSite();
	scrollableHeight = $body.height();
	
	// Scroll Variables
	currentScrollTop = $(window).scrollTop();
	previousScrollTop = currentScrollTop - 1;
	rotateValue = 0;
	
	// Percentage Scrolled
	updatePercentageScrolled();
	updateCountValue();
	
	// Adding the notAnimated Class
	$countBox.children().attr({
		id: function (indexValue, oldValue){
			return indexValue;
		}
	});
	$infographics.children().addClass("notAnimated").attr({
		id: function (indexValue, oldValue){
			return "info" + indexValue;
		}
	});
	$countBox.addClass("notAnimated");
	
	// Rain
	makeRain();
	$rainDrops = $(".rainDrop");
	raining();
	
	// Resize elements when page is fully loaded or resized
	$(window).resize(resizeElements);
	$body.addClass("hideAll");
	window.onload = function()
	{
		$body.removeClass("hideAll");
		resizeElements();
		// Intro
		$introScreen.delay(1000).fadeOut(2000);
	}
	
	$(window).scroll(function(){		
		// PERCENTAGE SCROLLED ---------------------------------------------------------------
		updatePercentageScrolled();
		updateCountValue();
		
		rotateValue < 345 ? rotateValue += 15 : rotateValue = 0;
		
		
		// DIRECTION VARIABLES ---------------------------------------------------------------
		if(currentScrollTop > previousScrollTop)
		{
			// Train Going Right
			directionOp = "-";
			trainDirection = "+";
			directionNum = 1;
		}
		else
		{
			// Train Going Left
			directionOp = "+";
			trainDirection = "-";
			directionNum = -1;
		}
		
		$train.css({transform: "scaleX(" + directionNum + ")"});
		
		// RESETS ---------------------------------------------------------------------------		
		if(percentageScrolled == 0)
		{
			resizeElements();
		}
		if(($train.css("left") <= $auschwitz.css("left")) && directionOp == "+")
		{
			$(window).scrollTop(0);
		}
		if(percentageScrolled > 98)
		{
			if($countBox.hasClass("notAnimated"))
			{
				$exitScreen.stop().fadeIn(3000);
				$countBox.removeClass("notAnimated").css("zIndex", 100).animate({
					top: (centerVertically($countBox) - windowHeight * 0.1) + "px",
					left: windowWidth * 0.03 + "px",
					width: windowWidth * 0.97 + "px",
					fontSize: "3em"
				}, 3000, function(){
					$(exitScreen).find("h3").stop().fadeIn(3000);
				});
			}
		}
		else
		{
			if(! $countBox.hasClass("notAnimated"))
			{
				console.log("hi");
				$exitScreen.stop().fadeOut(3000, function(){
					$countBox.stop().css("zIndex", 20).animate({
						top: windowHeight * 0.85 + "px",
						left: (windowWidth * 0.4) /2 + "px",
						width: windowWidth * 0.6 + "px",
						fontSize: "1.5em"
					}, 3000, function(){
						$(exitScreen).find("h3").stop().fadeOut(3000);
						$countBox.addClass("notAnimated");
					});
				});
				
			}
		}
		
		// Rain
		if(percentageScrolled > 30 && percentageScrolled < 50)
		{
			$body.addClass("rainOn");
			$rainDrops.fadeIn(2000);
			raining();
		}
		else
		{
			$rainDrops.fadeOut(2000, function(){
				$body.removeClass("rainOn");
			});
		}
		
		// Animation of Elements
		reuseElements();
		animateInfographics();
		animateTrain();

		previousScrollTop = currentScrollTop;
	});
});

// Resize Elements
function resizeElements()
{
	// Window Dimensions Resets
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	resetLengthOfSite();
	scrollableHeight = $body.height();
	updatePercentageScrolled();
	
	$countBox.css({top: windowHeight * 0.85 + "px", width: windowWidth * 0.6 + "px", left: centerHorizontally($countBox) + "px"});

	$grass.css({width: windowWidth + "px", height: windowHeight + "px"});
	
	$sky.css({width: windowWidth + "px", height: windowHeight / 2.5 + "px"});
	
	$auschwitz.css({top: centerVertically($auschwitz) - ($auschwitz.outerHeight() * 0.05), left: "0px"});
	
	$train.css({top: centerVertically($train) + ($train.outerHeight() * 0.2)});
	
	$wheelContainers.css({height: $train.outerHeight() * 0.2 + "px"});
	
	$trainTrack.css({top: centerVertically($trainTrack) + ($trainTrack.outerHeight() * 5)});
	
	$ground.css({width: windowWidth + "px", top: centerVertically($ground) + ($ground.outerHeight() * 0.9)});
	
	$bergenBelsen.css({top: centerVertically($bergenBelsen) + ($bergenBelsen.outerHeight() * 0.1), left: windowWidth + "px"});
	
	$rainDrops.each(function(){
		$(this).css({
			width: windowWidth * 0.005 + "px",
			height: windowHeight * 0.02 + "px",
			top: windowHeight * Math.random() + "px",
			left: windowWidth * Math.random() + "px",
			borderRadius: windowWidth * 0.4 + "px"});
	});
	
	$infographics.children().each(function(){
		$(this).css({left: centerHorizontally($(this))});
	});
	
	$introScreen.css({width: windowWidth + "px", height: windowHeight + "px"})
		.children().each(function(){
			$(this).css({top: centerVertically($(this)), left: centerHorizontally($(this))});
		});

	$exitScreen.css({width: windowWidth + "px", height: windowHeight + "px"})
		.fadeOut()
		.children().each(function(){
			$(this).css({width: windowWidth * 0.9 + "px", left: centerHorizontally($(this))});
		})
		.find("h3").fadeOut();
		
	$mountains.each(function(){
		$(this).css({top: centerVertically($(this)) - ($(this).outerHeight() * 0.7)});
	});
	
	$treesFront.children().each(function(){
		$(this).css({top: windowHeight - ($(this).outerHeight() * 0.8), left: $(this).data("spacing") * windowWidth + "px"});
	});
	
	$treesBack.children().each(function(){
		$(this).css({top: centerVertically($(this)) - ($(this).outerHeight() * 0.2), left: $(this).data("spacing") * windowWidth + "px"});
	});
}

// Reuse Elements
function reuseElements() {
	// Trees
	$allTrees.each(function(){
		var $this = $(this);
		
		if($this.css("left").split("p")[0] < -$this.width())
		{
			$this.css("left", windowWidth);
		}
		else if($this.css("left").split("p")[0] > windowWidth)
		{
			$this.css("left", -$this.width() + "px");
		}
	});
	
	// Train Track
	$trainTrack.each(function(){
		var $this = $(this);
		if($this.css("left").split("p")[0] < -($this.width()/2))
		{
			$this.css("left", 0);
		}
		else if($this.css("left").split("p")[0] > 0)
		{
			$this.css("left", -($this.width()/2));
		}
	});
}

// Update Count Value
function updateCountValue() {
	$countBox.children().each(function(){
		currentCountValue = Math.round((countValue / 100) * (currentScrollTop / (scrollableHeight - windowHeight)) * 100);
		valueString = currentCountValue.toString();
		
		// Ensure string always contains seven characters
		while(valueString.length < 7)
		{
			valueString = "0" + valueString;
		}
		
		var charValue = valueString.charAt(this.id);
		
		$(this).text(charValue);
	});
}

// Reset Length of Site
function resetLengthOfSite()
{
	$body.css({height: windowHeight * 40});
}

// Update Percentage Scrolled
function updatePercentageScrolled()
{
	currentScrollTop = $(window).scrollTop();
	percentageScrolled = Math.round((currentScrollTop / (scrollableHeight - windowHeight)) * 100);
	$scrollInfoSpan.html(percentageScrolled);
}

// Move All Background
function moveAllBackground()
{
	// Wheels
	$wheels.css("transform", "rotate(" + trainDirection + rotateValue + "deg)");
	
	// Mountains
	$mountains.css("left", -currentScrollTop / $mountains.data("speed") + "px");
	
	// Trees
	$allTrees.each(function(){
		$(this).css("left", directionOp + "=" + $(this).data("speed") + "%");
	});
	
	// Train Track
	$trainTrack.css({left: directionOp + "=" + $trainTrack.data("speed") + "px"});

	// Auschwitz
	if(percentageScrolled < 20)
	{	
		// Auschwitz Moving
		$auschwitz.each(function(){
			if(directionOp == "+")
			{
				// Train Going Left
				if($(this).css("left").split("p")[0] < 0)
				{
					$(this).css({left: directionOp + "=" + $(this).data("speed") + "px"});
				}
			}
			else
			{
				// Train Going Right
				if($(this).css("left").split("p")[0] > -$(this).outerWidth())
				{
					$(this).css({left: directionOp + "=" + $(this).data("speed") + "px"});
					
				}
			}
		});
	}
	else if (percentageScrolled <= 10)
	{
		// Auschwitz Fully Visible
		$auschwitz.css({left: $auschwitz.outerWidth() * 0.9 + "px"});
	}
	else
	{
		// Auschwitz Hidden
		$auschwitz.css({left: -$auschwitz.outerWidth() + "px"});
	}
	
	// Bergen Belsen
	if(percentageScrolled > 80)
	{	
		// Bergen Belsen Moving
		$bergenBelsen.each(function(){
			if(directionOp == "+")
			{
				// Train Going Left
				if($(this).css("left").split("p")[0] < windowWidth)
				{
					$(this).css({left: directionOp + "=" + $(this).data("speed") + "px"});
				}
			}
			else
			{
				// Train Going Right
				if($(this).css("left").split("p")[0] > windowWidth - $(this).outerWidth())
				{
					$(this).css({left: directionOp + "=" + $(this).data("speed") + "px"});
				}
			}
		});
	}
	else if (percentageScrolled >= 90)
	{
		// Bergen Belsen Fully Visible
		$bergenBelsen.css({left: windowWidth - ($bergenBelsen.outerWidth() * 0.8) + "px"});
	}
	else
	{
		// Bergen Belsen Hidden
		$bergenBelsen.css({left: windowWidth + "px"});
	}
}

// Animate Train
function animateTrain()
{
	// TRAIN and BACKGROUND ---------------------------------------------------------------
	$train.each(function(){
		var $this = $(this);
		var dataSpeed = $this.data("speed");

		if(percentageScrolled < 10)
		{
			if(directionOp == "+")
			{
				// Train Going Left
				if($this.css("left").split("p")[0] > 0)
				{
					$this.css({left: trainDirection + "=" + dataSpeed + "px"});
				}
				else
				{
					moveAllBackground();
				}
			}
			else
			{
				// Train Going Right
				if($this.css("left").split("p")[0] < ((windowWidth - $this.outerWidth()) / 2))
				{
					$this.css({left: trainDirection + "=" + dataSpeed + "px"});
				}
				else
				{
					moveAllBackground();
				}
			}
		}
		else if(percentageScrolled > 90)
		{
			if(directionOp == "+")
			{
				// Train Going Left
				if($this.css("left").split("p")[0] > ((windowWidth - $this.outerWidth()) / 2))
				{
					$this.css({left: trainDirection + "=" + dataSpeed + "px"});
				}
				else
				{
					moveAllBackground();
				}
			}
			else
			{
				// Train Going Right
				if($this.css("left").split("p")[0] < windowWidth - $this.outerWidth())
				{
					$this.css({left: trainDirection + "=" + dataSpeed + "px"});
				}
			}
		}
		else
		{
			moveAllBackground();
		}
	});
}

// Animate Infographics
function animateInfographics()
{
	// INFOGRAPHICS ---------------------------------------------------------------------
	$infographics.children().each(function(){
		
		// Info 0
		if(percentageScrolled > 9 && percentageScrolled < 18)
		{
			if($("#info0").hasClass("notAnimated"))
			{
				$("#info0").stop().removeClass("notAnimated").css("display", "block").animate({
					top: centerVertically($(this)) - ($(this).outerHeight() / 2) + "px"},
					2000);
			}
		}
		else
		{
			if(! $("#info0").hasClass("notAnimated"))
			{
				$("#info0").stop().addClass("notAnimated").animate({
					top: -$(this).outerHeight()}, 2000
				);
			}
		}
		
		// Info 1
		if(percentageScrolled > 18 && percentageScrolled < 27)
		{
			if($("#info1").hasClass("notAnimated"))
			{
				$("#info1").stop().removeClass("notAnimated")
					.css({top: centerVertically($(this)) - ($(this).outerHeight() / 2) + "px"})
					.fadeIn(2000);
			}
		}
		else
		{
			if(! $("#info1").hasClass("notAnimated"))
			{
				$("#info1").stop().addClass("notAnimated").fadeOut(2000);
			}
		}
		
		// Info 2
		if(percentageScrolled > 27 && percentageScrolled < 36)
		{
			if($("#info2").hasClass("notAnimated"))
			{
				$("#info2").stop().removeClass("notAnimated").css("display", "block").animate({
					fontSize: $("#info0").css("fontSize"),
					opacity: "1"}, 2000);
			}
		}
		else
		{
			if(! $("#info2").hasClass("notAnimated"))
			{
				$("#info2").stop().addClass("notAnimated").animate({
					fontSize: "0em", 
					opacity: "0"}, 1000
				);
			}
		}
		
		// Info 3
		if(percentageScrolled > 36 && percentageScrolled < 45)
		{
			if($("#info3").hasClass("notAnimated"))
			{
				$("#info3").stop().removeClass("notAnimated").slideDown(2000);
			}
		}
		else
		{
			if(! $("#info3").hasClass("notAnimated"))
			{
				$("#info3").stop().addClass("notAnimated").slideUp(1000);
			}
		}
		
		// Info 4
		if(percentageScrolled > 45 && percentageScrolled < 54)
		{
			if($("#info4").hasClass("notAnimated"))
			{
				$("#info4").stop().each(function(){
					$(this).css({left: - $(this).outerWidth(), display: "block"});
				}).removeClass("notAnimated").animate({
					left: centerHorizontally($(this))
					}, 2000);
			}
		}
		else
		{
			if(! $("#info4").hasClass("notAnimated"))
			{
				$("#info4").stop().addClass("notAnimated").animate({left: windowWidth},2000);
			}
		}
		
		// Info 5
		if(percentageScrolled > 54 && percentageScrolled < 63)
		{
			if($("#info5").hasClass("notAnimated"))
			{
				$("#info5").stop().each(function(){
					$(this).css({width: "0px", left: centerHorizontally($(this)), fontSize: "0em", display: "block"});
				})
				.removeClass("notAnimated").animate({
					fontSize: $("#info0").css("fontSize"),
					width: windowWidth * 0.5,
					left: centerHorizontally($(this))
					},2000);
			}
		}
		else
		{
			if(! $("#info5").hasClass("notAnimated"))
			{
				$("#info5").stop().addClass("notAnimated").fadeOut(2000);
			}
		}
		
		// Info 6
		if(percentageScrolled > 63 && percentageScrolled < 72)
		{
			if($("#info6").hasClass("notAnimated"))
			{
				$("#info6").stop().removeClass("notAnimated")
				.fadeIn(2000);
			}
		}
		else
		{
			if(! $("#info6").hasClass("notAnimated"))
			{
				$("#info6").stop().addClass("notAnimated").slideUp(2000);
			}
		}
		
		// Info 7
		if(percentageScrolled > 72 && percentageScrolled < 81)
		{
			if($("#info7").hasClass("notAnimated"))
			{
				$("#info7").stop().removeClass("notAnimated").slideDown(2000);
			}
		}
		else
		{
			if(! $("#info7").hasClass("notAnimated"))
			{
				$("#info7").stop().addClass("notAnimated").slideUp(2000);
			}
		}
		
		// Info 8
		if(percentageScrolled > 81 && percentageScrolled < 90)
		{
			if($("#info8").hasClass("notAnimated"))
			{
				$("#info8").stop().removeClass("notAnimated").show(2000);
			}
		}
		else
		{
			if(! $("#info8").hasClass("notAnimated"))
			{
				$("#info8").stop().addClass("notAnimated").hide(2000);
			}
		}
		
		// Info 9
		if(percentageScrolled > 90 && percentageScrolled < 98)
		{
			if($("#info9").hasClass("notAnimated"))
			{
				$("#info9").stop().removeClass("notAnimated")
				.fadeIn(2000);
			}
		}
		else
		{
			if(! $("#info9").hasClass("notAnimated"))
			{
				$("#info9").stop().addClass("notAnimated")
				.animate({
					top: windowHeight,
					opacity: 0
				},
				2000, function(){
					$(this).css({
						display: "none",
						top: $("#info6").css("top"),
						opacity: 1
					})
				});
			}
		}
	});
}

// Make Rain
function makeRain()
{
	for(var i = 0; i < 20; i++)
	{
		$("<div class='rainDrop'></div>").appendTo("#rain");
		
	}
}

// Raining
function raining()
{
	if($body.hasClass("rainOn"))
	{
		$rainDrops.each(function(){
			if($(this).css("top").split("p")[0] >= windowHeight)
			{
				$(this).css({
					top: -$(this).outerHeight() + "px", 
					left: windowWidth * Math.random() + "px",
				});
			}
			else
			{
				$(this).css({
					top: "+=" + $("#rain").data("speed") + "px"
				});
			}
		});
		window.requestAnimationFrame(raining);
	}
}

// Center Elements
function centerVertically($centerY)
{
	return (windowHeight - $centerY.outerHeight()) / 2;
}

function centerHorizontally($centerX)
{
	return (windowWidth / 2) - ($centerX.outerWidth() / 2);
}