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
  resizeAction(()=>{
   
  });
}

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

/**
 * 디자인 모달
 * @param {*} option
 */
function DesignModal(option) {
  this.title = option.title;
  this.message = option.message;
  this.domHtml = document.querySelector("html");
  this.domBody = document.querySelector("body");
  this.pagewrap = document.querySelector(".page_wrap");
  this.design_modal_wrap = null;
  this.btn_dmsmidentify = null;
  this.btn_dmsmcancel = null;
  this.duration = option.duration !== undefined ? option.duration : 400;
  this.initShow(option);
}

DesignModal.prototype.initShow = function(option) {
  var innerPublish = "";
  var objThis = this;
  let confirmPublish =
    option.type === "confirm" ?
    `취소` :
    `닫기`;
  /* 
  innerPublish += "<div class='design_modal_wrap'>";
  innerPublish += "  <div class='bg_design_modal'></div>";
  innerPublish += "  <div class='design_modal_w'>";
  innerPublish += "          <div class='design_modal'>";

  innerPublish += "              <div class='design_modal_cont_w'><div class='design_modal_text'></div></div>";
  innerPublish += "              <div class='btn_dmsm_wrap'>";
  if (option.type === "confirm") {
    innerPublish += "              <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>취소</a>";
  }
  innerPublish += "                  <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>";
  innerPublish += "              </div>";
  innerPublish += "          </div>";
  innerPublish += "  </div>";
  innerPublish += "</div>";
 */
  innerPublish = `
  <div class='design_modal_wrap'>
    <div class='design_modal_tb'>
      <div class='design_modal_td'>
        <div class='bg_design_modal'></div>
        <div class='design_modal'>
          <div class='design_modal_cont_w'>
            <div class='design_modal_maintext'></div>
            <div class='design_modal_subtext'></div>
          </div>
          <div class='btn_dmsm_wrap'>
          
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmcancel'>${confirmPublish}</a>
          <a href='javascript:;' class='btn_dmsm close_dmtrigger btn_dmsmidentify'>확인</a>
          </div>
          <a href='javascript:;' class='btn_modal_close'><span class='hdtext'>닫기</span></a>
        </div>
      </div>
    </div>
  </div>
  `;

  this.modalparent = document.createElement("div");
  this.pagewrap.appendChild(this.modalparent);
  this.modalparent.classList.add("design_modal_insert_wrap");
  this.modalparent.innerHTML = innerPublish;
  this.closetrigger = document.querySelectorAll(".close_dmtrigger");
  this.design_modal_wrap = document.querySelector(".design_modal_wrap");
  this.btn_modal_close = document.querySelector(".btn_modal_close");

  if (option.type === "confirm" || option.type === "alert") {
    this.design_modal_tit = document.querySelector(".design_modal_tit");
    this.design_modal_text = document.querySelector(".design_modal_maintext");
    this.design_modal_subtext = document.querySelector(".design_modal_subtext");
    this.btn_dmsmidentify = document.querySelector(".btn_dmsmidentify");

    if(!!option.main_message){
      this.design_modal_text.innerHTML = option.main_message;
    }else{
      this.design_modal_text.remove();
    }

    if(!!option.sub_message){
      this.design_modal_subtext.innerHTML = option.sub_message;

    }else{
      this.design_modal_subtext.remove();
    }
  }
  if (option.type === "confirm") {
    this.btn_dmsmcancel = document.querySelector(".btn_dmsmcancel");
  }
  if (option.type === "title") {
    this.design_modal_tit.innerHTML = option.title;
  }

  this.bindEvent(option);
};
DesignModal.prototype.show = function() {
  this.pagewrap.style.zIndex = 0;
  this.domHtml.classList.add("touchDis");

  this.design_modal_wrap.classList.add("active");
  setTimeout(() => {
    this.design_modal_wrap.classList.add("motion");
  }, 30);
};
DesignModal.prototype.hide = function() {
  var objThis = this;
  this.design_modal_wrap.classList.remove("motion");
  setTimeout(function() {
    objThis.design_modal_wrap.classList.remove("active");
    document.querySelector(".design_modal_insert_wrap").remove();
    objThis.design_modal_wrap.remove();
    objThis.domHtml.classList.remove("touchDis");
  }, 530);
};
DesignModal.prototype.bindEvent = function(option) {
  var objThis = this;
  let btn_close_item = [this.btn_modal_close, ...this.closetrigger];
  btn_close_item.forEach((element, index) => {
    element.addEventListener(
      "click",
      function() {
        objThis.hide();
      },
      false
    );
  });
  if (this.btn_dmsmidentify !== null) {
    this.btn_dmsmidentify.addEventListener(
      "click",
      function() {
        if (option.identify_callback !== undefined) {
          option.identify_callback();
        }
      },
      false
    );
  }
  if (this.btn_dmsmcancel !== null) {
    this.btn_dmsmcancel.addEventListener(
      "click",
      function() {
        if (option.cancel_callback !== undefined) {
          option.cancel_callback();
        }
      },
      false
    );
  }
};
