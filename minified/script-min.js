var fileSaverSupported,stylePrefix=$("input[name=style]:checked").val(),userText="",keysArray="",htmlCode="";try{new Blob;fileSaverSupported=!0}catch(e){fileSaverSupported=!1}function dataURItoBlob(e){for(var t=atob(e.split(",")[1]),n=e.split(",")[0].split(":")[1].split(";")[0],r=new ArrayBuffer(t.length),i=new Uint8Array(r),a=0;a<t.length;a++)i[a]=t.charCodeAt(a);return new Blob([r],{type:n})}function appendImg(e){let t=new Image;t.src=e,$("#img-preview").html(""),$("#img-preview").append(t),$("#preview-div").css("display","block")}function saveAsPng(){let e=$("#html-output"),t=prompt("Enter the Scale: ",2);if(null==t)return;if(t=!1===isNaN(t)?parseInt(t):2,t>10&&!confirm("Are You Sure? Scale More than 10 Can Make your Device Lag"))return;let n=10*Math.round(e.width()*t/10),r=10*Math.round(e.height()*t/10);domtoimage.toPng(e[0],{width:n,height:r,style:{transform:"scale("+t+")",transformOrigin:"top left"}}).then((function(e){!0===fileSaverSupported?saveAs(dataURItoBlob(e),"key2Img-"+n+"x"+r+".png"):(appendImg(e),$("#output-demension").text("Height: "+r+"px, Width: "+n))})).catch((function(e){alert("oops, something went wrong!\n"+e)}))}function saveAsJpeg(){let e=$("#html-output"),t=prompt("Enter the Scale: ",2),n=prompt("Quality (0.1 - 1): ",.5);if(null==t||null==n)return;if(!1!==isNaN(t)&&!1!==isNaN(n)||(t=parseInt(t),n=parseFloat(n)),0!==t&&0!==n||(t=1,parseFloat(.5)),n>1&&(n=.5),t>10&&!confirm("Are You Sure? Scale More than 10 Can Make your Device Lag"))return;let r=10*Math.round(e.width()*t/10),i=10*Math.round(e.height()*t/10);domtoimage.toJpeg(e[0],{quality:n,width:r,height:i,style:{transform:"scale("+t+")",transformOrigin:"top left"}}).then((function(e){!0===fileSaverSupported?saveAs(dataURItoBlob(e),"key2Img-"+r+"x"+i+".jpeg"):(appendImg(e),$("#output-demension").text("Height: "+i+"px, Width: "+r))})).catch((function(e){alert("oops, something went wrong!\n"+e)}))}const replaceIco=e=>e.split(" ").map((e=>iconMap[e]??e)).join(" ");function renderKeys(){var e=$("#text-input").val(),t=e.split("+").map(replaceIco);t=(t=$.map(t,$.trim)).filter((e=>e));var n="";if(""==e)n="<kbd class="+stylePrefix+">Ctrl</kbd>+<kbd class="+stylePrefix+">Alt</kbd>+<kbd class="+stylePrefix+">C</kbd>";else for(let e=0;e<t.length;e++)e==t.length-1?n+="<kbd class="+stylePrefix+">"+t[e]+"</kbd>":n+="<kbd class="+stylePrefix+">"+t[e]+"</kbd>+";return $("#output-location").html(n),0}$("#save-jpg").on("click",saveAsJpeg),$("#save-png").on("click",saveAsPng),$("#text-input").keyup(renderKeys),$("input[name=style]").on("click",(function(e){stylePrefix=$("input[name=style]:checked").val(),renderKeys()})),window.onload=e=>{null==Cookies.get("firstTime")&&(Cookies.set("firstTime","no",{expires:365}),introJs().setOptions({steps:introSteps}).start()),renderKeys()};