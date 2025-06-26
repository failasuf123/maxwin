export type Itinerary = {
    id: string;
    title: string;
    userOwner: string;
    userAccess?: string[];
    isPublic: boolean;
    totalCost: number;
    description?: string;
    createdAt: Date;
    imageCover?: string;
    tag?: string[];
    Cities?: City[];
    dateStart?: Date;
    dateEnd?: Date;
    itineraries: ItineraryPerDay[];
    budgeting?: {
      budget: BudgetItem[];
      expend: ExpendingItem[];
    };
  };
  
  export type ItineraryPerDay = {
    uniqueId: string;
    id_order_day: number;
    day: number;
    date?: Date;
    city?: City;
    todos: Todo[];
  };

  export type City = {
    cityId:number;
    cityName:string;
  }
  
  type BaseTodo = {
    id_order_todo: number;
    nameTodo: string;
    descriptionTodo?: string;
    isPayable: boolean;
    cost?: number;
    imgTodoUrl?: string;
  };
  
  export type HotelTodo = BaseTodo & {
    uniqueId: string;
    typeTodo: "hotel";
    // checkInTime: string;
    // checkOutTime:string;
    time_start?: string;
    time_end?: string;
    //Penting: Mulai kebawah menyesuaikan parameter dari API AGODA
    hotelId: number;
    currency: string; 
    landingURL: string;
    roomTypeName?: string; 
    starRating: number;
    reviewCount: number;
    reviewScore: number;
    crossedOutRate: number;
    discountPercentage: number;
    includeBreakfast: boolean;
    freeWifi: boolean;
  }

  export type HotelAgodaAPI = {
    hotelId: number;
    hotelName: string;
    dailyRate: number;
    currency: string; 
    imageURL: string;
    landingURL: string;
    roomTypeName?: string | undefined; 
    starRating: number;
    reviewCount: number;
    reviewScore: number;
    crossedOutRate: number;
    discountPercentage: number;
    includeBreakfast: boolean;
    freeWifi: boolean;
  }
  

  
  export type ActivityTodo = BaseTodo & {
    uniqueId?: string;
    typeTodo: "activity";
    time_start?: string;
    time_end?: string;
    location?: string;
  };
  
  export type TransportationTodo = BaseTodo & {
    uniqueId?: string;
    typeTodo: "Transportasi";
    departureTime?: string;
    arrivalTime?: string;
    range: string;
    transportType?: TransportationType ;
    origin?: string;
    destination?: string;
  };
  
  export type Todo = HotelTodo | ActivityTodo | TransportationTodo;
  
  export type TodoType = "hotel" | "activity" | "Transportasi"  | "Makan & minum" 
  | "Belanja" 

  | "Gaya hidup" 
  | "Cadangan"
  | "Lain-lain";;

  export type TransportationType =
  | "train"
  | "plane"
  | "bus"
  | "walk"
  | "car"
  | "motorcycle"
  | "bike"
  | "taxi"
  | "ride_hailing_car"      // ✅ untuk GrabCar, Gojek car, GoCar, etc
  | "ride_hailing_bike"     // ✅ untuk Gojek bike, GrabBike, etc
  | "ferry"
  | "etc";
  


  // ================

  export type BudgetItem = {
    id: string;
    index: string;
    budgetName: string;
    budget: number;
    keterangan: string;
  }

  export type ExpendingItem = {
    id: string;
    index: string;
    budgetName: string;
    budget: number;
    keterangan: string;
    link?: string;
    day?: string;
    category?: string;
  }

  export type ActivityRecommendation = {
    nama: string;
    deskripsi: string;
    akses_lokasi: string;
    icon: string;
    estimated_cost: number;
    keterangan: string;
    cityId: number;
  }

  