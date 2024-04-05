const offset = new Date().getTimezoneOffset() * 60000;
const now = new Date(Date.now() - offset).toISOString().substring(0, 10);
$('#start_date').val(now);
$('#end_date').val(now);


// 검색 시 서버에 전달할 객체
let data = {
    currentPage: '1',
    start_date: $('#start_date').val(),
    end_date: $('#end_date').val(),
    cust_nm: $('#cust_nm').val(),
    item_nm: $('#item_nm').val(),
    initem_no: $('initem_no').val()
};

let tempData = {};
// 검색
const searchInitem = function () {
    tempData = { ...data };
    data.currentPage = '1';
    data.start_date = $('#start_date').val();
    data.end_date = $('#end_date').val();
    data.cust_nm = $('#cust_nm').val();
    data.item_nm = $('#item_nm').val();
    data.initem_no = $('initem_no').val();
    getTableRow();
}

// 테이블 리스트 ajax
const getTableRow = function () {
    // 검색 기능
    $.ajax({
        type: "GET",
        url: "/searchInitems",
        data,
        success: (res) => {
            console.log(res);

            if (res.initems.length == 0) {
                alert('조회가능한 정보가 없습니다.');
                data = tempData;
                return;
            }

            const tbody = $('#initemListTable');
            tbody.empty();
            $('.pageNum').remove();
            res.initems.forEach((item, idx) => {
                tbody.append(
                    `
                    <tr onclick="detailView('${item.initem_no}')" style="cursor:pointer;">
                        <th scope="row">${idx + 1 + (res.page.currentPage - 1) * res.page.rowPage}</th>
                        <td>${item.initem_no}</td>
                        <td>${item.initem_dt}</td>
                        <td>${item.cust_nm}</td>
                        <td>${item.item_nm}</td>
                    </tr>
                    `
                )
            });
            for (let i = res.page.startPage; i <= res.page.endPage; i++) {
                $('#nextPageLi').before(
                    `
                    <li class="page-item pageNum"><button class="page-link" onclick="goPage('${i}')">${i}</button></li>
                    `
                );
            }
            document.getElementById('nextPageBtn').dataset.totalPage = res.page.totalPage;
        },
        beforeSend: () => {
            $('body').append(
                `
                <div id="ajaxLoadingImg" style="z-index:1091;" class="spinner-border text-primary position-absolute top-50 start-50" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                `
            )
        },
        complete: () => {
            $('#ajaxLoadingImg').remove();
        }

    });
}

// 페이지 이동함수
const goPage = function (i) {
    data.currentPage = i;
    getTableRow();
}

const nextPage = function (element) {
    if (data.currentPage >= element.dataset.totalPage) {
        alert('마지막 페이지 입니다.');
        return;
    }
    data.currentPage = data.currentPage * 1 + 1;
    getTableRow();
}

const prevPage = function () {
    if (data.currentPage == '1') {
        alert('첫 페이지 입니다.');
        return;
    }
    data.currentPage = '' + (data.currentPage * 1 - 1);
    getTableRow();
}


const detailView = function (initem_no) {
    $('#detailModal').modal('show');
}