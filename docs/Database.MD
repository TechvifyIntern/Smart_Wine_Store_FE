CREATE DATABASE WineStoreDatabase

-- ========================
-- 1. ACCOUNT & AUTHENTICATION
-- ========================
--user
CREATE TABLE Roles (
RoleID SERIAL PRIMARY KEY,
RoleName VARCHAR(50) NOT NULL UNIQUE,
Description TEXT
);

CREATE TABLE Tiers (
TierID SERIAL PRIMARY KEY,
TiersName VARCHAR(50) NOT NULL UNIQUE,
MinimumPoint INT NOT NULL
);

CREATE TABLE Users (
UserID SERIAL PRIMARY KEY,
UserName VARCHAR(50) NOT NULL,
Email VARCHAR(100) NOT NULL UNIQUE,
PhoneNumber VARCHAR(20) NULL,
Birthday DATE NULL,
Point INT DEFAULT 0,
RoleID INT NOT NULL,
TierID INT NOT NULL,
CONSTRAINT fk_role FOREIGN KEY(RoleID) REFERENCES Roles(RoleID) ON DELETE RESTRICT,
CONSTRAINT fk_tiers FOREIGN KEY(TierID) REFERENCES Tiers(TierID) ON DELETE RESTRICT
);

--warehouse
CREATE TABLE Warehouses (
WarehouseID SERIAL PRIMARY KEY,
Location VARCHAR(255) NOT NULL
);

--account

CREATE TABLE Account_Statuses (
StatusID SERIAL PRIMARY KEY,
StatusName VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Accounts (
UserID INT PRIMARY KEY,
Password VARCHAR(255) NOT NULL,
RefreshToken VARCHAR(500) NULL,
ExpireAt TIMESTAMP NULL,
StatusID INT,
CONSTRAINT fk_account_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
CONSTRAINT fk_account_status FOREIGN KEY(StatusID) REFERENCES Account_Statuses(StatusID) ON DELETE SET NULL
);

CREATE TABLE Sellers (
SellerID SERIAL PRIMARY KEY,
UserID INT,
WarehouseID INT NULL,
CONSTRAINT fk_seller_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
CONSTRAINT fk_seller_warehouse FOREIGN KEY(WarehouseID) REFERENCES Warehouses(WarehouseID) ON DELETE SET NULL
);

CREATE TABLE User_Address (
UserAddressID SERIAL PRIMARY KEY,
UserID INT NOT NULL,
StreetAddress VARCHAR(255) NOT NULL,
Ward VARCHAR(100) NOT NULL,
Province VARCHAR(100) NOT NULL,
IsDefault BOOLEAN NOT NULL DEFAULT FALSE,
CONSTRAINT fk_user_address FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
CONSTRAINT uq_user_address UNIQUE (UserID, StreetAddress, Ward, Province)
);

-- ========================
-- 2. VERIFICATION
-- ========================
CREATE TABLE Verification_Types (
VerificationTypeID SERIAL PRIMARY KEY,
VerificationName VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Verification_Codes (
VerificationID SERIAL PRIMARY KEY,
UserID INT,
VerificationCode VARCHAR(6) NOT NULL,
CreatedAt TIMESTAMP NOT NULL,
ExpireAt TIMESTAMP NOT NULL,
VerificationTypeID INT,
CONSTRAINT fk_verification_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
CONSTRAINT fk_verification_type FOREIGN KEY(VerificationTypeID) REFERENCES Verification_Types(VerificationTypeID) ON DELETE RESTRICT
);

-- ========================
-- 3. PRODUCT & INVENTORY
-- ========================
CREATE TABLE Categories (
CategoryID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
CategoryName VARCHAR(100) NOT NULL UNIQUE,
Description VARCHAR(255),
CategoryParentID INT NULL,
CONSTRAINT fk_parent_category
FOREIGN KEY (CategoryParentID)
REFERENCES Categories(CategoryID)
ON DELETE SET NULL
);

CREATE TABLE Products (
ProductID SERIAL PRIMARY KEY,
ProductName VARCHAR(255) NOT NULL,
CategoryID INT,
ImageURL VARCHAR(255) NULL,
CostPrice DECIMAL(12,2) NOT NULL CHECK(CostPrice > 0),
SalePrice DECIMAL(12,2) NOT NULL CHECK(SalePrice > 0),
isActive BOOLEAN NOT NULL DEFAULT TRUE,
CONSTRAINT fk_product_category FOREIGN KEY(CategoryID) REFERENCES Categories(CategoryID) ON DELETE RESTRICT
);

CREATE TABLE Product_Detail (
ProductDetailID SERIAL PRIMARY KEY,
ProductID INT,
Size INT NULL,
ABV DECIMAL(4,2) NULL,
Producer VARCHAR(100) NULL,
Origin VARCHAR(100) NULL,
Varietal VARCHAR(100) NULL,
DescriptionTitle TEXT NULL,
DescriptionContents TEXT NULL,
CONSTRAINT fk_product_detail FOREIGN KEY(ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

CREATE TABLE Inventories (
InventoryID SERIAL PRIMARY KEY,
WarehouseID INT,
ProductID INT,
Quantity INT NOT NULL,
CONSTRAINT fk_inventory_warehouse FOREIGN KEY(WarehouseID) REFERENCES Warehouses(WarehouseID) ON DELETE RESTRICT,
CONSTRAINT fk_inventory_product FOREIGN KEY(ProductID) REFERENCES Products(ProductID) ON DELETE RESTRICT,
CONSTRAINT uq_inventory UNIQUE (WarehouseID, ProductID)
);

CREATE TABLE Inventory_Transaction_Types (
TypeID SERIAL PRIMARY KEY,
TypeName VARCHAR(50) NOT NULL,
Factor INT NOT NULL CHECK (Factor IN (1, -1)),
Description VARCHAR(255)
);

CREATE TABLE Inventory_log (
InventoryLogID SERIAL PRIMARY KEY,
TransactionTypeID INT,
UserID INT,
Username_Snapshot VARCHAR(50),
Email_Snapshot VARCHAR(100),
PhoneNumber_Snapshot VARCHAR(20),
InventoryID INT,
Location_Snapshot VARCHAR(255),
ProductName_Snapshot VARCHAR(255),
Quantity INT NOT NULL,
Date TIMESTAMP NOT NULL,
CONSTRAINT fk_log_transaction FOREIGN KEY(TransactionTypeID) REFERENCES Inventory_Transaction_Types(TypeID) ON DELETE SET NULL,
CONSTRAINT fk_log_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
CONSTRAINT fk_log_inventory FOREIGN KEY(InventoryID) REFERENCES Inventories(InventoryID) ON DELETE SET NULL
);

-- ========================
-- 4. CART
-- ========================
CREATE TABLE Carts (
CartID SERIAL PRIMARY KEY,
UserID INT UNIQUE,
CONSTRAINT fk_cart_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Cart_Items (
CartItemID SERIAL PRIMARY KEY,
CartID INT,
ProductID INT,
Quantity INT NOT NULL,
CONSTRAINT fk_cart_item_cart FOREIGN KEY(CartID) REFERENCES Carts(CartID) ON DELETE CASCADE,
CONSTRAINT fk_cart_item_product FOREIGN KEY(ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
CONSTRAINT uq_cart_item UNIQUE (CartID, ProductID)
);

-- ========================
-- 5. DISCOUNT
-- ========================
CREATE TABLE Discount_Types (
DiscountTypeID SERIAL PRIMARY KEY,
DiscountTypeName VARCHAR(50) NOT NULL UNIQUE,
isAvailable BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Discounts (
DiscountID SERIAL PRIMARY KEY,
TypeID INT,
DiscountValue DECIMAL(12,2) NOT NULL check(DiscountValue > 0),
CONSTRAINT fk_discount_type FOREIGN KEY(TypeID) REFERENCES Discount_Types(DiscountTypeID) ON DELETE RESTRICT
);

CREATE TABLE Discount_Event (
DiscountEventID SERIAL PRIMARY KEY,
DiscountID INT NULL,
EventName VARCHAR(100) NOT NULL,
Description VARCHAR(255),
TimeStart TIMESTAMP NOT NULL,
TimeEnd TIMESTAMP NOT NULL,
CONSTRAINT fk_event_discount FOREIGN KEY(DiscountID) REFERENCES Discounts(DiscountID) ON DELETE SET NULL,
CONSTRAINT chk_discount_event_time CHECK (TimeEnd > TimeStart)
);

CREATE TABLE Discount_Order (
DiscountOrderID SERIAL PRIMARY KEY,
DiscountID INT,
MinimumOrderValue DECIMAL(12,2) NOT NULL,
CONSTRAINT fk_discount_order_discount FOREIGN KEY(DiscountID) REFERENCES Discounts(DiscountID) ON DELETE RESTRICT
);

CREATE TABLE Discount_Product (
DiscountProductID SERIAL PRIMARY KEY,
ProductID INT,
DiscountID INT NULL,
TimeStart TIMESTAMP NOT NULL,
TimeEnd TIMESTAMP NOT NULL,
CONSTRAINT fk_discount_product FOREIGN KEY(ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
CONSTRAINT fk_discount_product_discount FOREIGN KEY(DiscountID) REFERENCES Discounts(DiscountID) ON DELETE SET NULL,
CONSTRAINT chk_discount_product_time CHECK (TimeEnd > TimeStart)
);

CREATE TABLE Discount_Tier (
DiscountTierID SERIAL PRIMARY KEY,
TierID INT,
DiscountID INT,
CONSTRAINT fk_discount_tier FOREIGN KEY(TierID) REFERENCES Tiers(TierID) ON DELETE CASCADE,
CONSTRAINT fk_discount_tier_discount FOREIGN KEY(DiscountID) REFERENCES Discounts(DiscountID) ON DELETE RESTRICT
);

-- ========================
-- 6. ORDER
-- ========================
CREATE TABLE Order_Statuses (
StatusID SERIAL PRIMARY KEY,
StatusName VARCHAR(50) NOT NULL,
Description VARCHAR(255)
);

CREATE TABLE Orders (
OrderID SERIAL PRIMARY KEY,
UserID INT,
UserName VARCHAR(50),
Email VARCHAR(100),
PhoneNumber VARCHAR(20),
OrderStreetAddress VARCHAR(255),
OrderWard VARCHAR(100),
OrderProvince VARCHAR(100),
CreatedAt TIMESTAMP NOT NULL,
Subtotal DECIMAL(12,2),
DiscountTierID INT,
DiscountTierValue DECIMAL(12,2),
DiscountID INT,
DiscountValue DECIMAL(12,2),
FinalTotal DECIMAL(12,2),
StatusID INT,
CONSTRAINT fk_order_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
CONSTRAINT fk_order_tier FOREIGN KEY(DiscountTierID) REFERENCES Discount_Tier(DiscountTierID) ON DELETE SET NULL,
CONSTRAINT fk_order_general FOREIGN KEY(DiscountID) REFERENCES Discounts(DiscountID) ON DELETE SET NULL,
CONSTRAINT fk_order_status FOREIGN KEY(StatusID) REFERENCES Order_Statuses(StatusID) ON DELETE SET NULL
);

CREATE TABLE Order_Detail (
DetailID SERIAL PRIMARY KEY,
OrderID INT,
ProductID INT,
ProductName VARCHAR(255),
Quantity INT NOT NULL check(Quantity >0),
UnitPrice DECIMAL(12,2),
DiscountValue DECIMAL(12,2),
FinalItemPrice DECIMAL(12,2),
CONSTRAINT fk_order_detail_order FOREIGN KEY(OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
CONSTRAINT fk_order_detail_product FOREIGN KEY(ProductID) REFERENCES Products(ProductID) ON DELETE SET NULL
);

-- ========================
-- 7. PAYMENT
-- ========================
CREATE TABLE Payment_Methods (
PaymentMethodID SERIAL PRIMARY KEY,
MethodName VARCHAR(50) NOT NULL UNIQUE,
IsEnabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Payment_Transactions (
PaymentTransactionID SERIAL PRIMARY KEY,
OrderID INT,
PaymentMethodID INT,
Amount DECIMAL(12,2) NOT NULL CHECK (Amount > 0),
TransactionCode VARCHAR(100) UNIQUE,
CreatedAt TIMESTAMP NOT NULL,
Note VARCHAR(255),
CONSTRAINT fk_payment_order FOREIGN KEY(OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
CONSTRAINT fk_payment_method FOREIGN KEY(PaymentMethodID) REFERENCES Payment_Methods(PaymentMethodID) ON DELETE RESTRICT
);

-- ========================
-- 8. AUDITING
-- ========================
-- ENUM cho AuditLogs
CREATE TYPE Enum_AuditLog_Status AS ENUM ('Success', 'Failure');

CREATE TABLE ActionTypes (
ActionTypeID SERIAL PRIMARY KEY,
ActionTypeName VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE AuditLogs (
AuditLogID SERIAL PRIMARY KEY,
UserID INT,
ActionTypeID INT,
TableName VARCHAR(100) NOT NULL,
RecordID INT NOT NULL,
OldValues JSONB,
NewValues JSONB,
UpdatedTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Status Enum_AuditLog_Status NOT NULL,
CONSTRAINT fk_audit_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
CONSTRAINT fk_audit_action FOREIGN KEY(ActionTypeID) REFERENCES ActionTypes(ActionTypeID) ON DELETE SET NULL
);

-- ========================
-- 9. NOTIFICATIONS
-- ========================
CREATE TABLE Notification_Types (
NotificationTypeID SERIAL PRIMARY KEY,
NotificationName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Notifications (
NotificationID SERIAL PRIMARY KEY,
UserID INT,
Title TEXT NOT NULL,
Content TEXT NULL,
LinkURL VARCHAR(255),
isRead BOOLEAN NOT NULL DEFAULT FALSE,
CreatedAt TIMESTAMP NOT NULL,
NotificationTypeID INT,
CONSTRAINT fk_notification_user FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
CONSTRAINT fk_notification_type FOREIGN KEY(NotificationTypeID) REFERENCES Notification_Types(NotificationTypeID) ON DELETE SET NULL
);
