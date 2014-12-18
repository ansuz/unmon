var cache={}
  ,swap=function(s,o){return s.replace(/{\w+}/g,function(k){return o[k]||k;});};
var stopAndRender=function(e){
  $.stop(e);
  render($(this).attr('id'));
};

var makeAnchors=function(){
  var $toc=$('.toc');
  var headings="";
  $('#content > h2').each(function(e){
    e.name=e.id;
    e.innerHTML=swap("<a class='anchor' name='{NAME}' href='#{NAME}'># </a>",
      {"{NAME}":e.name
    })+e.innerHTML;
    // link to the anchors in the table of contents
    headings+="<li><a href='#"+e.name+"'>"+e.innerHTML+"</a></li>"
  });
  if(headings===""){
    $toc.hide();
  }else{
    $toc.html("<ul>"+headings+"</ul>");
    $toc.show();
    $toc.css("display","block");
  }
};

var render = function(key,back){
  if(!key)return;
  if(key in cache){
    console.log("rendering %s",key);
    document.title=key;
    $('#main > .header > h1').html("[ /"+key+" ]"); // set title of page.
    $('#content').html(cache[key]);
    makeAnchors();
    // make in-page links behave like the nav bar
    $('#content a').each(function(e){
      // determine if it's a local link
      var $e=$(e);
      var link=$e.attr('href')||"!";
      if(link.match(/^\/.*/)&&!link.match(/\.\w+/)){
        $e.on('click',function(e){
          $.stop(e);
          render(link.slice(1));
        });
      }
    });
    if(!back)window.history.pushState("", key, "/"+key);
  }else{
    $.ajax("/"+key+".json",function(k){
      console.log("fetching %s",key);
      cache[key] = marked(JSON.parse(k).txt);
      render(key);
    });
  }
};

$(function(){ // wait until the page has loaded

  (function(){ // UI stuff for responsive menu
    var $layout=$('#layout'), 
      $menu=$('#menu'),
      $menuLink=$('#menuLink');
    $menuLink.on('click',function(e){
      $.stop(e);
      $layout.toggleClass('active');
      $menu.toggleClass('active');
      $menuLink.toggleClass('active');
    });
  })();

  // in body links are not currently being treated like sidebar links
  // they trigger a page reload, this should be factored out
  // and applied to all in page links

  $.ajax("/nav.json",function(res){ // get the navigation data
    var nav=JSON.parse(res).nav; // fetch the navigation data
    // On page ready, fill up the sidebar menu..
    $('#nav-list').html(nav.map(function(x){
      return "<li><a id='"+x+"' href='/"+x+"'>"+x+"</a></li>";
    }).join(""));
    // if they click a local link, fetch it, cache it, and render it
    $('#nav-list > li > a').on('click',stopAndRender); 
  });

// cache the original content, since you won't be fetching it again...
  var base=window.location.pathname.slice(1)||"index";
  cache[base]=$('.content').html();
  render(base);

  window.onpopstate = function(){
    render(window.location.pathname.slice(1)||"index",true);
  };
});
