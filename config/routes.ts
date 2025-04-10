import component from "@/locales/en-US/component";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	
	
	  

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	///////////////////////////////////
	// QUẢN LÝ SỔ VĂN BẰNG
	{
		path: '/quan-ly-so-van-bang',
		name: 'Quản lý sổ văn bằng',
		routes: [
			{
				path: '/quan-ly-so-van-bang/so-van-bang',
				name: 'Sổ văn bằng',
				component: './thuchanh4/QuanLySoVanBang/SoVanBang',
			},
			{
				path: '/quan-ly-so-van-bang/quyet-dinh-tot-nghiep',
				name: 'Quyết định tốt nghiệp',
				component: './thuchanh4/QuanLySoVanBang/QuyetDinhTotNghiep',
			},
			{
				path: '/quan-ly-so-van-bang/cau-hinh-bieu-mau',
				name: 'Cấu hình biểu mẫu',
				component: './thuchanh4/QuanLySoVanBang/CauHinhBieuMau',
			},
			{
				path: '/quan-ly-so-van-bang/thong-tin-van-bang',
				name: 'Thông tin văn bằng',
				component: './thuchanh4/QuanLySoVanBang/ThongTinVanBang',
			},
		],
	},
	


	///////////////////////////////////
	// TRA CỨU VĂN BẰNG
	{
		path: '/tra-cuu-van-bang',
		name: 'Tra cứu văn bằng',
		component: './thuchanh4/TraCuuVanBang',
	},
	{
		path: '/quan-ly-nhan-vien',
		name: 'Quản Lý Nhân Viên',
		icon: 'UserOutlined',
		component: './nhanvien/OrderManagement',
	},
	{
        name: "Quản lý câu lạc bộ",
        path: "ThucHanh05",
        component: "./ThucHanh05",
        icon: "TeamOutlined",
        routes: [
            {
                name: "Tổng quan",
                path: "./",
                component: "./ThucHanh05/Dashboard",
                icon: "DashboardOutlined",
            },
            {
                name: "Quản lý CLB",
                path: "clubs",
                component: "./ThucHanh05/ClubManagement/ClubList",
                icon: "TeamOutlined",
            },
            {
                name: "Quản lý đơn đăng ký",
                path: "applications",
                component: "./ThucHanh05/ApplicationManagement/ApplicationList",
                icon: "FormOutlined",
            },
            {
                name: "Quản lý thành viên",
                path: "members",
                component: "./ThucHanh05/MemberManagement/ClubMembers",
                icon: "UserOutlined",
            }
        ]
    },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
