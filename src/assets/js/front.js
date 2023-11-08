window.addEventListener("DOMContentLoaded", () => {
  commonInit();
  
});
window.addEventListener("load", () => {
  layoutFunc();
});

$(function() {
})

/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf("samsung") > -1) {
    browserAdd("samsung");
  }

  if (
    navigator.platform.indexOf("Win") > -1 ||
    navigator.platform.indexOf("win") > -1
  ) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }

  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/*
  resize
*/
function resizeAction(callback){
  let windowWid = 0;
  window.addEventListener("resize",()=>{
    if(window.innerWidth !== windowWid){
      if(callback){
        callback();
      }
    }
    windowWid = window.innerWidth;
  });
}

/**
 * 레이아웃
 */
function layoutFunc() {
  const page_wrap = document.querySelector(".page_wrap");
  const top_layer_wrap = document.querySelector(".top_layer_wrap");
  const top_layer_wrap_dtype2 = document.querySelector(".top_layer_wrap.dtype2");
  const top_layer_content = document.querySelector(".top_layer_content");
  const bottom_layer_wrap = document.querySelector(".bottom_layer_wrap");
  const bottom_layer_content = document.querySelector(".bottom_layer_content");
  const btn_page_top = document.querySelector(".btn_page_top");

  layerLayout();
  resizeAction(()=>{
    layerLayout();
  });
  window.addEventListener("scroll",(e)=>{
    if(!!top_layer_wrap_dtype2){
      if(window.scrollY > 0){
        top_layer_wrap_dtype2.classList.remove("dtype2");
      }else{
        top_layer_wrap_dtype2.classList.add("dtype2");
      }
    }
  });

  if(!!btn_page_top){
    btn_page_top.addEventListener("click",()=>{
      window.scrollTo({
        top : 0,
        left : 0,
        behavior : 'smooth'
      })
    });
  }

  function layerLayout(){

    if(!!page_wrap && !!top_layer_content){
      page_wrap.style.paddingTop = top_layer_content.getBoundingClientRect().height + "px";
    }

    if(!!page_wrap && !!bottom_layer_content){
      page_wrap.style.paddingBottom = bottom_layer_content.getBoundingClientRect().height + "px";
    }
  }
}

/*  */

/**
 * menu rock
 */
function menuRock(target) {
  const targetDom = document.querySelector(target);
  if (!!targetDom) {
    targetDom.classList.add("active");
  }
}

function siblings(t) {
  var children = t.parentElement.children;
  var tempArr = [];

  for (var i = 0; i < children.length; i++) {
    tempArr.push(children[i]);
  }

  return tempArr.filter(function(e) {
    return e != t;
  });
}

/* popup */
function DesignPopup(option) {
  this.option = option;
  this.selector = this.option.selector;
  if (this.selector !== undefined) {
    this.selector = document.querySelector(this.option.selector);
  }
  
  this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.layer_wrap_parent = null;
  this.btn_closeTrigger = null;
  this.btn_close = null;
  this.bg_design_popup = null;
  this.scrollValue = 0;

  this.btn_closeTrigger = null;
  this.btn_close = null;

  const popupGroupCreate = document.createElement("div");
  popupGroupCreate.classList.add("layer_wrap_parent");

  
  
  if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
    this.pagewrap.append(popupGroupCreate);
  }

  this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");

  // console.log(this.selector.querySelectorAll(".close_trigger"));

  this.bindEvent();
}

DesignPopup.prototype.dimCheck = function() {
  const popupActive = document.querySelectorAll(".popup_wrap.active");
  if (!!popupActive[0]) {
    popupActive[0].classList.add("active_first");
  }
  if (popupActive.length > 1) {
    this.layer_wrap_parent.classList.add("has_active_multi");
  } else {
    this.layer_wrap_parent.classList.remove("has_active_multi");
  }
};
DesignPopup.prototype.popupShow = function() {
  this.design_popup_wrap_active =
    document.querySelectorAll(".popup_wrap.active");

  if (this.selector == null) {
    return;
  }
  this.domHtml.classList.add("touchDis");

  this.selector.classList.add("active");
  setTimeout(() => {
    this.selector.classList.add("motion_end");
  }, 30);
  if ("beforeCallback" in this.option) {
    this.option.beforeCallback();
  }

  if ("callback" in this.option) {
    this.option.callback();
  }
  if (!!this.design_popup_wrap_active) {
    this.design_popup_wrap_active.forEach((element, index) => {
      if (this.design_popup_wrap_active !== this.selector) {
        element.classList.remove("active");
      }
    });
  }
  //animateIng = true;

  this.layer_wrap_parent.append(this.selector);

  this.dimCheck();

  // this.layer_wrap_parent

  // ****** 주소 해시 설정 ****** //
  // location.hash = this.selector.id
  // modalCount++
  // modalHash[modalCount] = '#' + this.selector.id
};
DesignPopup.prototype.popupHide = function() {
  var target = this.option.selector;
  if (target !== undefined) {
    this.selector.classList.remove("motion");
    if ("beforeClose" in this.option) {
      this.option.beforeClose();
    }
    //remove
    this.selector.classList.remove("motion_end");
    setTimeout(() => {
      this.selector.classList.remove("active");
    }, 400);
    this.design_popup_wrap_active =
      document.querySelectorAll(".popup_wrap.active");
    this.dimCheck();
    if ("closeCallback" in this.option) {
      this.option.closeCallback();
    }
    if (this.design_popup_wrap_active.length == 1) {
      this.domHtml.classList.remove("touchDis");
    }
  }
};

DesignPopup.prototype.bindEvent = function() {
  this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
  this.bg_design_popup = this.selector.querySelector(".bg_dim");
  var closeItemArray = [...this.btn_close];

  // this.selector.querySelector(".popup_content_row").addEventListener("scroll",(e)=>{
  //   console.log(this.selector.querySelector(".popup_content_row").scrollTop)
  // });
  if (!!this.selector.querySelectorAll(".close_trigger")) {
    this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
    closeItemArray.push(...this.btn_closeTrigger);
  }
  // if (!!this.bg_design_popup) {
  //   closeItemArray.push(this.bg_design_popup);
  // }
  if (closeItemArray.length) {
    closeItemArray.forEach((element) => {
      element.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          this.popupHide(this.selector);
        },
        false
      );
    });
  }
};

function categorySwiper(target){
  let swiper_menu_obj = null;
	const swiper_menu_swiper = document.querySelector(target);
	const swiper_menu_slide = !!swiper_menu_swiper ? swiper_menu_swiper.querySelectorAll(".swiper-slide") : null;
	if(!!swiper_menu_slide){
		if(swiper_menu_obj !== null){
			swiper_menu_obj.update();
		}else{
			swiper_menu_obj = new Swiper(target, {
				slidesPerView: 'auto',
				slidesPerGroupAuto : true,
				freeMode: true,
			});
		}
	}
}


function detailTopSwiper() {
  let detail_swiper_obj = null;
  const detail_header_wrap = document.querySelector(".detail_header_wrap");
  const detail_photo_swiper = document.querySelector("#detail_photo_container");
  const d_count_current = detail_header_wrap.querySelector(".d_count_current");
  const d_count_length = detail_header_wrap.querySelector(".d_count_length");
  const detail_photo_slide = !!detail_photo_swiper ? detail_photo_swiper.querySelectorAll(".swiper-slide") : null;
  if (!!detail_photo_slide) {
    if (detail_swiper_obj !== null) {
      detail_swiper_obj.update();
    } else {
      d_count_length.textContent = detail_photo_slide.length;
      detail_swiper_obj = new Swiper("#detail_photo_container", {
        speed : 1000, 
				autoplay: {
					delay: 2500,
					disableOnInteraction: false
				},
        loop : true
      });
      detail_swiper_obj.on("slideChange",()=>{
        d_count_current.textContent = detail_swiper_obj.realIndex+1;
      });
    }
  }
}

function activeItemGroup(items){
  const itemTarget = items;
  if(!!itemTarget){
    itemTarget.forEach((item) => {
      const loopItem = document.querySelectorAll(item);
      if(!!loopItem){
        loopItem.forEach((element)=>{
          const elementObj = element;
          elementObj.addEventListener("click",(e)=>{
            const eventItem = e.currentTarget;
            const elementParent = eventItem.closest("[data-parent]");
            const elementNot = elementParent.querySelectorAll(item)
            if(!!elementNot){
              elementNot.forEach((notItem)=>{
                if(notItem !== eventItem){
                  notItem.classList.remove("active");
                }
              })
            }
            eventItem.classList.toggle("active");
          });
        })
      }
    });
  }
}

function activeToggle(items){
  const itemTarget = items;
  if(!!itemTarget){
    itemTarget.forEach((item) => {
      const loopItem = document.querySelectorAll(item);
      if(!!loopItem){
        loopItem.forEach((element)=>{
          const elementObj = element;
          elementObj.addEventListener("click",(e)=>{
            const eventItem = e.currentTarget;
            eventItem.classList.toggle("active");
          });
        })
      }
    });
  }
}