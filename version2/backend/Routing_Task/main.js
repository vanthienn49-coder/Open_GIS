// =========================================================
// 1. KHỞI TẠO BẢN ĐỒ
// =========================================================
// Khởi tạo bản đồ, thiết lập tâm mặc định tại Quy Nhơn
let map = L.map("map").setView([13.763, 109.219], 14);

//// Thêm lớp bản đồ nền từ Google Maps (Chuẩn chủ quyền Việt Nam)
L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN", {
  attribution: "© Google Maps",
  maxZoom: 19,
}).addTo(map);

// =========================================================
// 2. KHAI BÁO BIẾN LƯU TRỮ TOÀN CỤC
// =========================================================
let routingStart = null; // Tọa độ điểm xuất phát
let routingEnd = null; // Tọa độ điểm đến
let currentRouteLayer = null; // Chứa nét vẽ tuyến đường trên bản đồ
let startMarker = null; // Ghim điểm xuất phát
let endMarker = null; // Ghim điểm đến

// =========================================================
// 3. XỬ LÝ SỰ KIỆN CLICK CHỌN ĐIỂM TRÊN BẢN ĐỒ
// =========================================================
map.on("click", function (e) {
  let lat = e.latlng.lat;
  let lon = e.latlng.lng;

  // Tạo nội dung Popup chứa 2 nút bấm
  let popupContent = `
        <div style="min-width: 160px; text-align: center; font-family: Arial;">
            <h4 style="margin: 0 0 10px 0;">Điểm chọn trên bản đồ</h4>
            <button onclick="setRoutePoint('start', ${lon}, ${lat})" style="width: 100%; margin-bottom: 8px; padding: 6px; cursor: pointer; background: #e0f7fa; border: 1px solid #00bcd4; border-radius: 4px;">📍 Từ đây (Xuất phát)</button>
            <button onclick="setRoutePoint('end', ${lon}, ${lat})" style="width: 100%; padding: 6px; cursor: pointer; background: #ffe0b2; border: 1px solid #ff9800; border-radius: 4px;">🚩 Đến đây (Đích đến)</button>
        </div>
    `;

  L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
});

// =========================================================
// 4. HÀM THIẾT LẬP ĐIỂM XUẤT PHÁT / ĐIỂM ĐẾN
// =========================================================
function setRoutePoint(type, lon, lat) {
  if (type === "start") {
    routingStart = { lon: lon, lat: lat };
    if (startMarker) map.removeLayer(startMarker); // Xóa ghim cũ nếu có
    startMarker = L.marker([lat, lon])
      .addTo(map)
      .bindPopup("<b>Điểm Xuất Phát</b>")
      .openPopup();
  } else if (type === "end") {
    routingEnd = { lon: lon, lat: lat };
    if (endMarker) map.removeLayer(endMarker); // Xóa ghim cũ nếu có
    endMarker = L.marker([lat, lon])
      .addTo(map)
      .bindPopup("<b>Điểm Đến</b>")
      .openPopup();
  }

  map.closePopup(); // Đóng popup chọn điểm vừa click

  // Nếu đã có đủ 2 điểm đi và đến, tự động chạy tìm đường
  if (routingStart && routingEnd) {
    fetchAndDrawRoute();
  }
}

// =========================================================
// 5. HÀM GỌI API TÌM ĐƯỜNG THỰC TẾ VÀ VẼ LÊN BẢN ĐỒ
// =========================================================
function fetchAndDrawRoute() {
  /* LƯU Ý DÀNH CHO NGƯỜI RÁP CODE BACKEND:
       Đoạn URL dưới đây đang dùng API miễn phí của OSRM để test giao diện thực tế.
       Khi có Database pgRouting, hãy đổi URL này thành đường dẫn gọi xuống Backend của hệ thống.
       Ví dụ: let apiUrl = "/api/find-route?start_lon=" + routingStart.lon + "...";
    */
  let osrmUrl = `https://router.project-osrm.org/route/v1/driving/${routingStart.lon},${routingStart.lat};${routingEnd.lon},${routingEnd.lat}?overview=full&geometries=geojson`;

  fetch(osrmUrl)
    .then((response) => response.json())
    .then((data) => {
      // Kiểm tra xem API có trả về tuyến đường không
      if (data.code === "Ok" && data.routes.length > 0) {
        let route = data.routes[0];

        // 1. Lấy thông số khoảng cách và thời gian
        let realDistanceKm = (route.distance / 1000).toFixed(2); // Đổi từ mét sang Km
        let realTimeMinute = Math.round(route.duration / 60); // Đổi từ giây sang Phút

        // 2. Xóa nét vẽ đường cũ trước khi vẽ đường mới
        if (currentRouteLayer) map.removeLayer(currentRouteLayer);

        // 3. Vẽ tuyến đường bám sát giao thông lên bản đồ
        currentRouteLayer = L.geoJSON(route.geometry, {
          style: {
            color: "#0078FF", // Màu xanh dương
            weight: 6, // Độ dày nét vẽ
            opacity: 0.8,
          },
        }).addTo(map);

        // Tự động thu phóng bản đồ để hiển thị trọn vẹn đường đi
        map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });

        // 4. Cập nhật thông số ra bảng UI góc màn hình
        document.getElementById("route-dist").innerText = realDistanceKm;
        document.getElementById("route-time").innerText = realTimeMinute;
        document.getElementById("routing-info").style.display = "block"; // Hiển thị bảng
      } else {
        alert("Không thể tìm thấy tuyến đường bộ kết nối 2 điểm này!");
      }
    })
    .catch((error) => {
      console.error("Lỗi tìm đường:", error);
      alert("Đã xảy ra lỗi khi kết nối với máy chủ tìm đường.");
    });
}

// =========================================================
// 6. HÀM HỦY TÌM ĐƯỜNG / DỌN DẸP BẢN ĐỒ
// =========================================================
function clearRoute() {
  if (currentRouteLayer) map.removeLayer(currentRouteLayer);
  if (startMarker) map.removeLayer(startMarker);
  if (endMarker) map.removeLayer(endMarker);

  // Reset lại biến lưu trữ
  routingStart = null;
  routingEnd = null;

  // Ẩn bảng thông số
  document.getElementById("routing-info").style.display = "none";
}
// =========================================================
// 7. TÌM KIẾM ĐỊA ĐIỂM CÓ GỢI Ý TỰ ĐỘNG (AUTOCOMPLETE)
// =========================================================
let searchInput = document.getElementById("search-input");
let suggestionsList = document.getElementById("suggestions-list");
let typingTimer; // Biến hẹn giờ gõ phím
let doneTypingInterval = 500; // Đợi 0.5s sau khi ngừng gõ mới tìm kiếm

// Lắng nghe sự kiện mỗi khi người dùng gõ phím vào ô tìm kiếm
searchInput.addEventListener("input", function () {
  clearTimeout(typingTimer); // Hủy hẹn giờ cũ nếu người dùng vẫn đang gõ
  let query = searchInput.value.trim();

  // Nếu gõ ít hơn 2 ký tự thì ẩn gợi ý
  if (query.length < 2) {
    suggestionsList.style.display = "none";
    return;
  }

  // Bắt đầu đếm ngược 0.5s để gọi API
  typingTimer = setTimeout(() => fetchSuggestions(query), doneTypingInterval);
});

// Hàm gọi API lấy danh sách gợi ý
function fetchSuggestions(query) {
  // Thêm countrycodes=vn để ưu tiên tìm kiếm ở Việt Nam cho chính xác
  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=vn`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      suggestionsList.innerHTML = ""; // Xóa gợi ý cũ

      if (data.length > 0) {
        suggestionsList.style.display = "block"; // Hiện khung gợi ý

        // Duyệt qua kết quả và tạo từng dòng gợi ý
        data.forEach((item) => {
          let li = document.createElement("li");
          li.style.padding = "10px";
          li.style.cursor = "pointer";
          li.style.borderBottom = "1px solid #eee";
          li.style.fontSize = "13px";
          li.innerText = item.display_name;

          // Hiệu ứng hover đổi màu khi lia chuột
          li.onmouseover = () => (li.style.background = "#f5f5f5");
          li.onmouseout = () => (li.style.background = "white");

          // Sự kiện Click vào một gợi ý
          li.onclick = () => {
            searchInput.value = item.display_name; // Điền tên lên ô input
            suggestionsList.style.display = "none"; // Ẩn danh sách
            showLocationOnMap(
              parseFloat(item.lat),
              parseFloat(item.lon),
              item.display_name,
            );
          };

          suggestionsList.appendChild(li);
        });
      } else {
        suggestionsList.style.display = "none";
      }
    })
    .catch((err) => console.error("Lỗi lấy gợi ý:", err));
}

// Hàm hiển thị điểm tìm được lên bản đồ (Tách riêng ra để dùng lại)
function showLocationOnMap(lat, lon, placeName) {
  map.setView([lat, lon], 16);

  let popupContent = `
        <div style="min-width: 180px; text-align: center; font-family: Arial;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; word-wrap: break-word;">${placeName}</h4>
            <button onclick="setRoutePoint('start', ${lon}, ${lat})" style="width: 100%; margin-bottom: 8px; padding: 6px; cursor: pointer; background: #e0f7fa; border: 1px solid #00bcd4; border-radius: 4px;">📍 Từ đây (Xuất phát)</button>
            <button onclick="setRoutePoint('end', ${lon}, ${lat})" style="width: 100%; padding: 6px; cursor: pointer; background: #ffe0b2; border: 1px solid #ff9800; border-radius: 4px;">🚩 Đến đây (Đích đến)</button>
        </div>
    `;

  L.popup().setLatLng([lat, lon]).setContent(popupContent).openOn(map);
}

// Hàm chạy khi bấm nút "Tìm" hoặc ấn Enter
function triggerSearch() {
  let query = searchInput.value;
  if (query) {
    // Lấy kết quả đầu tiên của gợi ý để hiển thị
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=vn`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          suggestionsList.style.display = "none";
          showLocationOnMap(
            parseFloat(data[0].lat),
            parseFloat(data[0].lon),
            data[0].display_name,
          );
        }
      });
  }
}

// Ẩn danh sách gợi ý khi click ra ngoài vùng tìm kiếm
document.addEventListener("click", function (e) {
  if (!document.getElementById("search-container").contains(e.target)) {
    suggestionsList.style.display = "none";
  }
});

// Bắt sự kiện Enter trong ô input
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    triggerSearch();
  }
});
// =========================================================
// =========================================================
// 8. TÌM KIẾM ĐỊA ĐIỂM XUNG QUANH & HIỂN THỊ DANH SÁCH
// =========================================================
let poiLayer = L.layerGroup().addTo(map);

// Mảng chứa vài link ảnh món ăn/cảnh quan miễn phí trên Unsplash để làm ảnh minh họa
const placeholderImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&q=80",
];

function findNearby(type, typeName, icon) {
  poiLayer.clearLayers();
  let center = map.getCenter();
  let radius = 3000;
  let tagKey = type === "hotel" ? "tourism" : "amenity";

  let overpassQuery = `
        [out:json][timeout:15];
        nwr["${tagKey}"="${type}"](around:${radius},${center.lat},${center.lng});
        out center;
    `;

  fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(overpassQuery),
    headers: { "Content-type": "application/x-www-form-urlencoded" },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Máy chủ OSM từ chối kết nối");
      return response.json();
    })
    .then((data) => {
      if (!data.elements || data.elements.length === 0) {
        alert(`Không tìm thấy ${typeName} nào quanh khu vực này!`);
        document.getElementById("places-panel").style.display = "none";
        return;
      }

      let listHTML = ""; // Biến chứa mã HTML của toàn bộ danh sách

      data.elements.forEach((el, index) => {
        let lat = el.lat || (el.center && el.center.lat);
        let lon = el.lon || (el.center && el.center.lon);
        if (!lat || !lon) return;

        let name =
          el.tags && el.tags.name
            ? el.tags.name
            : `${typeName} (Chưa cập nhật tên)`;

        // Tính khoảng cách từ tâm bản đồ đến quán (đơn vị: mét)
        let distance = map.distance(center, L.latLng(lat, lon));
        let distanceText =
          distance > 1000
            ? (distance / 1000).toFixed(1) + " km"
            : Math.round(distance) + " m";

        // Giả lập Rating (từ 3.5 đến 5.0) và số lượt đánh giá
        let randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
        let randomReviews = Math.floor(Math.random() * 200) + 5;

        // Lấy 1 ảnh ngẫu nhiên trong mảng
        let imgUrl = placeholderImages[index % placeholderImages.length];

        // 1. Gắn Ghim lên bản đồ
        let popupContent = `<b>${icon} ${name}</b><br>Cách đây: ${distanceText}`;
        L.marker([lat, lon]).bindPopup(popupContent).addTo(poiLayer);

        // 2. Tạo giao diện cho 1 thẻ địa điểm trong danh sách bên trái
        listHTML += `
                <div class="place-card">
                    <img src="${imgUrl}" alt="Ảnh minh họa" class="place-img">
                    <div class="place-info">
                        <h4>${name}</h4>
                        <p>⭐ ${randomRating} (${randomReviews}) · ${distanceText}</p>
                        <p style="color: #137333;">Đang mở cửa</p>
                        <button class="action-btn" onclick="setRoutePoint('end', ${lon}, ${lat})">
                            📍 Đường đi
                        </button>
                    </div>
                </div>
            `;
      });

      // Đổ mã HTML vào khung và hiển thị nó lên
      document.getElementById("places-list-content").innerHTML = listHTML;
      document.getElementById("places-panel").style.display = "block";
    })
    .catch((error) => {
      console.error("Chi tiết lỗi:", error);
      alert(
        "Kết nối máy chủ định vị đang chậm. Bạn đợi vài giây rồi bấm lại nút nhé!",
      );
    });
}
// =========================================================
// 9. LẤY VỊ TRÍ HIỆN TẠI CỦA NGƯỜI DÙNG (GPS)
// =========================================================
let userLocationMarker = null; // Biến lưu cái chấm xanh vị trí của bạn

function locateUser() {
  // Kiểm tra xem trình duyệt có hỗ trợ GPS không
  if (!navigator.geolocation) {
    alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
    return;
  }

  // Hiển thị thông báo đang tìm kiếm...
  let btn = document.getElementById("gps-btn");
  let originalIcon = btn.innerHTML;
  btn.innerHTML = "⏳";

  // Gọi API xin quyền vị trí
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      // 1. Bay bản đồ đến vị trí hiện tại
      map.setView([lat, lon], 16);

      // 2. Xóa chấm xanh cũ (nếu có) và tạo chấm xanh mới y hệt Google Maps
      if (userLocationMarker) map.removeLayer(userLocationMarker);

      userLocationMarker = L.circleMarker([lat, lon], {
        radius: 8,
        fillColor: "#4285F4", // Màu xanh đặc trưng của Google
        color: "#ffffff", // Viền trắng
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map);

      // 3. Tiện tay chốt luôn điểm này làm Điểm Xuất Phát (routingStart)
      routingStart = { lat: lat, lon: lon };
      if (startMarker) map.removeLayer(startMarker);
      startMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup("<b>Vị trí của bạn (Xuất phát)</b>")
        .openPopup();

      // Trả lại icon nút bấm
      btn.innerHTML = originalIcon;
    },
    (error) => {
      btn.innerHTML = originalIcon;
      if (error.code === 1) {
        alert(
          "Bạn đã từ chối cấp quyền vị trí. Vui lòng bật lại quyền Location trên trình duyệt nhé!",
        );
      } else {
        alert("Không thể xác định được vị trí của bạn lúc này.");
      }
    },
    {
      enableHighAccuracy: true, // Yêu cầu độ chính xác cao nhất (Dùng GPS thực nếu có)
      timeout: 10000, // Đợi tối đa 10 giây
      maximumAge: 0,
    },
  );
}
