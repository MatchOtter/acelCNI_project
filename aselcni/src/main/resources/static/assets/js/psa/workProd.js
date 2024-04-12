	
// 생산일자는 오늘 날짜로 기본값으로 함
const today = document.getElementById('currentDate').value = new Date().toISOString().substring(0, 10);


// 중첩모달 닫기 클릭하면 첫번째 모달이 보여지도록
// $('#cancle').on('click', function(){
// 	$('#addItem').modal('hide');

// 	// 300ms(0.3초) 대기 후 이전 모달 표시
// 	setTimeout(function() {
// 		$('#prodplan').modal('show');
// 	}, 300); 
// })



// 날짜 계산 함수
function addDays(today, days) {
	
	
  	//const clone = new Date(date);
  	//clone.setDate(date.getDate() + days)
  	//alert(clone);
  	//document.getElementById('currentDate').value = clone;
  	//return clone;
  	
}

//const today = new Date();
//const tommorow = new Date(today);
//const yesterday = new Date(today);

//tommorow.setDate(today.getDate() + 1);
//yesterday.setDate(today.getDate() - 1);





// 투입품 추가 버튼 누르면 투입품 추가 모달 띄워지고 값 입력받음
$(function () {

    $("#btnSubmit").click(function (e) {
        e.preventDefault();
        $('#addItem').modal("show");
        //
    });

    $("#btn-submit").click(function() {
        // alert("Submit base form!");
        $("#btnSubmit").closest("form").submit();
    });
});



// 선택된 투입품 리스트 li 만드는 함수 
const liEle = function (el){
	let liTag = document.createElement("li");
	let spanTag1 = document.createElement("span");
	let spanTag2 = document.createElement("span");
	let inputTag = document.createElement("input")
	inputTag.setAttribute("type","number");
	let btnTag = document.createElement("button")
	btnTag.setAttribute("class","btn-close removeItem");
	btnTag.setAttribute("aria-label","Close");
	spanTag1.innerHTML=el.item_cd;
	spanTag2.innerHTML=el.item_nm;
	inputTag.value = el.in_qty;
	liTag.append(spanTag1);
	liTag.append(spanTag2);
	liTag.append(inputTag);
	liTag.append(btnTag);
	return liTag;
}

// 생산계획내역 조회 모달 이벤트
// tr 클릭했을때 이벤트 발생
$('#prodplanTB tbody tr').click(function() {

	let prodplan_emp_id = document.getElementById('prodplan_emp_id');
	let prp_user_nm = document.getElementById('prp_user_nm');
	let prodplan_no = document.getElementById('prodplan_no');
	let prp_prodplan_dt = document.getElementById('prp_prodplan_dt');
	let prp_item_cd = document.getElementById('prp_item_cd');
	let prp_item_nm = document.getElementById('prp_item_nm');
	let prp_qty = document.getElementById('prp_qty');
	let prp_work_dt = document.getElementById('prp_work_dt');
	let prp_remark = document.getElementById('prp_remark');

	// 공정 select box
	// let proc_nm = document.getElementById('proc_nm');

	// 투입품
	let in_item_nm = document.getElementById('in_item_nm');
	let in_item_cd = document.getElementById('in_item_cd');
	let in_qty = document.getElementById('in_qty');

	const prpParam = {
	  prodplan_no : $(this).data().index
	}

	console.log(prpParam);

	// ajax 1
	// 생산계획번호별 상세내용 조회 (공정, 투입품 제외)
	$.ajax({
	  url: 'prpInfoModal',
	  type: 'post',
	  data: JSON.stringify(prpParam),
	  contentType: 'application/json; charset=utf-8',
	  success: function(result) {
		console.log(result);

		prodplan_emp_id.value = result.prodplan_emp_id;
		prp_user_nm.value = result.user_nm;
		prodplan_no.value = result.prodplan_no;
		prp_prodplan_dt.value = result.prodplan_dt;
		prp_item_cd.value = result.item_cd;
		prp_item_nm.value = result.item_nm;
		prp_qty.value = result.qty;
		prp_work_dt.value = result.work_dt;
		prp_remark.value = result.remark;
	  }
	});

	// ajax 2
	// 생산계획에서 등록해둔 투입품 리스트 조회
	$.ajax({
	  url: 'planItemList',
	  type: 'post',
	  data: JSON.stringify(prpParam),
	  contentType: 'application/json; charset=utf-8',
	  success: function(result) {
		console.log(result);

		// 1. 테이블로 추가
		$('#prp_item_tr').empty();
		$('#prp_item_tbody').empty();

		result.forEach(element => {
			$('#prp_item_tbody').append(
				`<tr class="inItemList">
					<td>${element.item_cd}</td>
					<td>${element.item_nm}</td>
					<td><input type="number" value=${element.in_qty}>
					<button type="button" class="btn-close removeItem" aria-label="Close"></button></td>
				</tr>`
			);
		});

		// 2. ul, li로 추가
		// $('#inItemList').empty();

		// result.forEach(element => {

		//   console.log(result.length);
		//   console.log(element.item_cd+element.item_nm+element.in_qty);
		//   console.log(element.item_cd);

		//   // 2-1. 태그 생성 후 append
		//   $('#inItemList').append(
		//     `<li class="list-group-item">
		//       <span>${element.item_cd}</span>
		//       <span>${element.item_nm}</span>
		//       <input type="number" value=${element.in_qty}>
		//       <button type="button" class="btn-close removeItem" aria-label="Close"></button>
		//     </li>`
		//   );

		//   // 2-2. 태그 생성 함수 호출
		// //   $('#inItemList').append(liEle(element));

		// });

	  }
	});
});

// 조회된 투입품 리스트 빼기
// 버튼 .removeItem 클릭 시 추가된 품목 하나씩 제거
$(document).on('click', '.removeItem', function() {
  // $('.removeItem').on('click', function() {
	$(this).parent().parent().remove();
});

// 대분류에 맞는 중분류 조회
$('#big_no').on('change', function() {

	let big_no = $("#big_no option:selected").val();

	const bigParam = {
	  big_no : big_no
	}

	$.ajax({
	  url: 'getMidNo',
	  type: 'post',
	  data: JSON.stringify(bigParam),
	  contentType: 'application/json; charset=utf-8',

	  success : function(result) {
		console.log('result: ' + result);

		$('#mid_no').empty().append('<option>중분류 선택</option>');

		result.forEach((element) => {

		  console.log(element);
		  console.log(element.mid_content);

		  $('#mid_no').append('<option value="' + element.mid_no + '">' +
							  element.mid_content + "</option>");
		  
		});

		// 속성 추가
		$('#mid_no').attr('bigNo', result[0].big_no);
	  }
	});

});

// 대분류, 중분류에 맞는 소분류 조회
$('#mid_no').on('change',(event) => {

	let mid = event.target;
	let mid_no = mid.value;
	let big_no = mid.getAttribute('bigNo');

	console.log('big_no:', big_no);
	console.log('mid_no:', mid_no);

	const midParam = {
	  big_no : big_no,
	  mid_no : mid_no
	}

	$.ajax({
	  url: 'getSmlNo',
	  type: 'post',
	  data: JSON.stringify(midParam),
	  contentType: 'application/json; charset=utf-8',

	  success : function(result) {
		console.log('result: ' + result);

		$('#sml_no').empty().append('<option>소분류 선택</option>');;

		result.forEach(element => {

		  console.log(element);
		  console.log(element.sml_content);

		  $('#sml_no').append('<option value="' + element.sml_no + '">' +
							  element.sml_content + "</option>");

		});

		// 속성 추가
		$('#sml_no').attr('bigNo', result[0].big_no);
		$('#sml_no').attr('midNo', result[0].mid_no);

	  }
	});
});

// 대분류, 중분류, 소분류에 맞는 품목 리스트 조회 radio
$('#sml_no').on('change', function() {

	let big_no = $("#big_no option:selected").val();
	let mid_no = $("#mid_no option:selected").val();
	let sml_no = $("#sml_no option:selected").val();

	const itemParam = {
	  big_no : big_no,
	  mid_no : mid_no,
	  sml_no : sml_no
	}

	$.ajax({
	  url: 'addItemList',
	  type: 'post',
	  data: JSON.stringify(itemParam),
	  contentType: 'application/json; charset=utf-8',

	  success: function(array) {
		console.log(array);

		$('#addItem_tr').empty();
		$('#addItem_tbody').empty();

		array.forEach(element => {

		  	console.log(element);

			$('#addItem_tbody').append(
				`<tr>
					<td><input type="checkbox" name="addItemList" id="addItemList" value=${element.item_cd}></td>
					<td class="ele_item_cd">${element.item_cd}</td>
					<td class="ele_item_nm">${element.item_nm}</td>
				</tr>`
			);
		});

	  }
	});
});

// 선택한 투입품 리스트 임시저장할 배열
let tempSave = [];

// 투입품 저장 버튼 클릭 이벤트
$('#addItemSave').click(function() {

	// row 값 모두 담을 배열
	var rowData = new Array();

	// 각각 td의 값을 담을 배열
	var tdArr = new Array();

	// 체크된 체크박스 담을 변수
	var checkbox = $("input[name=addItemList]:checked");

	// 체크박스의 체크된 수만큼 반복
	checkbox.each(function(i) {

		// checkbox.parent() : checkbox의 부모는 <td>       
		// checkbox.parent().parent() : <td>의 부모이므로 <tr>
		var tr = checkbox.parent().parent().eq(i);
		var td = tr.children();

		// 체크된 row의 모든 값을 배열에 저장
		rowData.push(tr.text());

		// td.eq(0)은 체크박스
		var item_cd = td.eq(1).text();
		var item_nm = td.eq(2).text();

		// 가져온 값을 td 배열에 저장
		tdArr.push(item_cd);
		tdArr.push(item_nm);

		console.log('rowData'+rowData);
		console.log('tdArr item_cd:'+item_cd);
		console.log('tdArr item_nm:'+item_nm);

		// 객체화
		let addedItem = {
			item_cd : $('#addItemList:checked').val(),
			item_nm : item_nm
		};

		console.log('선택한 투입품 값: ' + addedItem);

		// 투입품 리스트 배열에 저장
		tempSave.push(addedItem);

	});

	// 배열에 저장된 길이만큼 반복
	tempSave.forEach(element => {

		$('#prp_item_tbody').append(
			`<tr>
				<td>${element.item_cd}</td>
				<td>${element.item_nm}</td>
				<td><input type="number">
				<button type="button" class="btn-close removeItem" aria-label="Close"></button></td>
			</tr>`
		);

	});

	// 투입품 모달 닫기
	$('#addItem').modal('hide');

	// 생산지시 등록 모달 띄우기
	$('#prodplan').modal('show');

});



// 생산지시 등록 모달 form 전송
$('form').on('submit', function(e){

	// form 전송 막기
	e.preventDefault(); 

	// 1. 일단 투입품, 공정 제외
	// 생산지시번호도 제외하고 - 컨트롤러 처리
	// 담당자 아이디도 제외하고 - 컨트롤러 처리
	let data = {
		prodplan_no : $('#prodplan_no').val(),
		workprod_dt : $('#prp_prodplan_dt').val(),
		item_cd : $('#prp_item_cd').val(),
		item_nm : $('#prp_item_nm').val(),
		qty : $('#prp_qty').val(),
		// proc_cd : $("#selectProc option:selected").val(),
		work_dt : $('#prp_work_dt').val(),
		work_cmd : $('#work_cmd').val(),
		remark : $('#prp_remark').val()
	}

	console.log('컨트롤러에 보내줄거: ' + data);	// object
	console.log('컨트롤러에 prodplan_no: ' + data.prodplan_no);
	console.log('컨트롤러에 workprod_dt: ' + data.workprod_dt);
	console.log('컨트롤러에 item_cd: ' + data.item_cd);
	console.log('컨트롤러에 item_nm: ' + data.item_nm);
	console.log('컨트롤러에 qty: ' + data.qty);
	// console.log('컨트롤러에 proc_cd: ' + data.proc_cd);
	console.log('컨트롤러에 work_dt: ' + data.work_dt);
	console.log('컨트롤러에 work_cmd: ' + data.work_cmd);
	console.log('컨트롤러에 remark: ' + data.remark);



	// 2. 공정 check box 값들 담을 배열
	var procArr = [];

	// 체크된 공정리스트 배열에 저장
	$("input[name=procList]:checked").each(function() {
		var chkProcList = $(this).val();
		procArr.push(chkProcList);
	});

	console.log('배열에 담긴 공정리스트'+procArr);



	// 3. 투입품 Map (key + value)
	let inItemMap = new Map();

	// if(!inItem.has(Key)){
	// 	inItem.set(Key, Value);
	// }

	// item_cd 담을 배열
	let itemCdArr = [];
	// $('#prp_item_tbody').find('td:eq(0)').text().push(itemCdArr);
	// console.log('코드 배열 '+itemCdArr);

	// in_qty 담을 배열
	let inQtyArr = [];
	// $('#prp_item_tbody').find('td:eq(2)').find('input').val().push(inQtyArr);
	// console.log('수량 배열 '+inQtyArr);

	let inItemArr = [];
	$('.inItemList').each(function(index, el) {
		// let inItemObj = {
		// 	item_cd : $('.inItemList').find('td:eq(0)').text(),
		// 	in_qty : $('.inItemList').find('td:eq(2)').find('input').val()
		// };
		// inItemArr.push(inItemObj);

		// let item_cd = $('.inItemList').find('td:eq(0)').text();
		// // itemCdArr.push(item_cd);

		// let in_qty = $('.inItemList').find('td:eq(2)').find('input').val();
		// // inQtyArr.push(in_qty);

		// inItemMap.set(item_cd, in_qty);

		console.log(index+'+'+el);
	})
	// console.log('투입품 배열??'+inItemArr);	
	// console.log('투입품 배열??'+inItemArr.inItemObj);	
	// console.log('투입품 배열??'+inItemArr.item_cd);	
	// console.log('투입품 배열??'+inItemArr.in_qty);	

	// console.log('코드 배열??'+itemCdArr);	
	// console.log('수량 배열??'+inQtyArr);	

	// console.log('투입품 맵 '+inItemMap);
	
	// // [키, 값] 쌍을 대상으로 순회합니다.
	// for (let [key, value] of inItemMap) { // map.entries()와 동일합니다.
	// 	console.log(key + ":" + value); // cucumber,500 ...
	// }


/*
	// ajax로 컨트롤러에 form 전송
	// ajax Promise 1-2-3
	new Promise((succ, fail) => {

		// ajax 1. 공정, 투입품 제외한 것
		$.ajax({

			url: 'workprodInsert',
			type: 'post',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',

			success: function(result) {
				console.log(result);
				succ(result);
			},
			fail: function(result) {
				fail(error);
			}
		});

	}).then((arg) => {

		// ajax 2. 공정 배열 전송
		$.ajax({

			url: 'workprocInsert',
		  	type: 'post',
		  	data: {"procArr" : procArr},
		  	dataType: 'json',

			// ajax로 배열 전송 시 필요한 설정
		  	traditional: true,

		  	success: function(result2) {
				console.log(result2);
				succ(result2);
			},
			fail: function(result2) {
				fail(error);
			}
		});

	}).then((arg) => {

		// ajax 3. 투입품
		$.ajax({

			url: 'workItemInsert',
			type: 'post',
			// data: ,

			success: function(result3) {
				console.log(result3);
				succ(result3);

				// 생산지시 등록 모달 닫기
				$('#prodplan').modal('hide');
			},
			fail: function(result3) {
				fail(error);
			}
		});

	});
*/
	// // ajax로 컨트롤러에 form 전송
	// // ajax 1. 공정, 투입품 제외한 것
	// $.ajax({
		
	// 	url: 'workprodInsert',
	// 	type: 'post',
	// 	data: JSON.stringify(data),
	// 	contentType: 'application/json; charset=utf-8',

	// 	success: function(result) {
	// 		console.log(result);




	// 		// 생산지시 등록 모달 닫기
	// 		$('#prodplan').modal('hide');
	// 	}
	// });

	
	
	// // ajax 2. 공정 배열 전송
	// $.ajax({

	// 	url : 'workprocInsert',
	//   	type : 'post',
	//   	data : {"procArr" : procArr},
	//   	dataType : 'json',

	// 	// ajax로 배열 전송 시 필요한 설정
	//   	traditional: true,

	//   	success : function(data){
	// 		console.log(data);
	// 	}
	// });

});
















 
// 생산지시내역 조회 모달 이벤트
// tr 클릭했을때 이벤트 발생
$('#workprodTB tbody tr').click(function() {

	let user_nm = document.getElementById('user_nm');
	let workprod_no = document.getElementById('workprod_no');
	let workprod_dt = document.getElementById('workprod_dt');
	let item_nm = document.getElementById('item_nm');
	let qty = document.getElementById('qty');
	let work_dt = document.getElementById('work_dt');
	let work_cmd = document.getElementById('work_cmd');
	let remark = document.getElementById('remark');

	const wprParam = {
	  workprod_no : $(this).data().index
	}

	console.log(wprParam);

	// ajax 1
	// 등록된 지시내역의 생산지시번호별 상세내용 조회 (공정, 투입품 제외)
	$.ajax({
	  url: 'wprInfoModal',
	  type: 'POST',
	  data: JSON.stringify(wprParam),
	  contentType: 'application/json; charset=utf-8',
	  success : function(result) {
		console.log(result);

		user_nm.value = result.user_nm;
		workprod_no.value = result.workprod_no;
		workprod_dt.value = result.workprod_dt;
		item_nm.value = result.item_nm;
		qty.value = result.qty;
		work_dt.value = result.work_dt;
		work_cmd.value = result.work_cmd;
		remark.value = result.remark;
	  }
	});

	// ajax 2
	  // 등록된 지시내역의 생산지시번호별 공정 리스트 조회
	$.ajax({
	  url: 'workProcList',
	  type: 'POST',
	  data: JSON.stringify(wprParam),
	  contentType: 'application/json; charset=utf-8',
	  success : function(result) {
		console.log(result);

		$("#proc_tr").each(function(index, element){

		  for(let i=0; i<result.length; i++) {

			console.log(result[i]);

			$('#proc_tbody').append('<tr><th>'+(i+1)+'</th><td>'+
									result[i].proc_cd+'</td><td>'+
									  result[i].proc_nm+'</td></tr>');

		  }
		})
	  }
	});

	// ajax 3
	// 등록된 지시내역의 생산지시번호별 투입품 리스트 조회
	$.ajax({
	  url: 'workItemList',
	  type: 'POST',
	  data: JSON.stringify(wprParam),
	  contentType: 'application/json; charset=utf-8',
	  success : function(result) {
		console.log(result);

		$("#in_item_tr").each(function(index, element){

		  for(let i=0; i<result.length; i++) {
		  
			console.log(result[i]);
		  
			$('#in_item_tbody').append('<tr><th>'+(i+1)+'</th><td>'+
									  result[i].item_cd+'</td><td>'+
										result[i].item_nm+'</td><td>'+
										  result[i].in_qty+'</td></tr>');
								  
		  }
		})
	  }
	});

});



