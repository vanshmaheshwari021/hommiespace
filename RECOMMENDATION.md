# HommieSpace Recommendation System Documentation

This document explains the architecture, algorithms, and logic behind the HommieSpace related products recommendation system.

---

## 1. How It Works

When a user visits a product details page on the storefront, the application requests the product attributes by its ID from the API server. In the backend handler:
1. The server fetches the current product from MongoDB.
2. It retrieves the product's `categoryId`.
3. It performs a content-based recommendation query using the category field to discover related pieces, while explicitly excluding the currently viewed product to prevent redundant listings:
   ```typescript
   const relatedProducts = await ProductModel.find({
     categoryId: product.categoryId,
     _id: { $ne: product._id },
     status: 'active'
   }).limit(4);
   ```
4. The list of matching products is returned and displayed as a curated **"You May Also Like"** grid.

---

## 2. Choosing the Content-Based Filtering Algorithm

We implemented a **Content-Based Filtering (CBF)** approach based on product category attributes for several critical architectural reasons:

* **Cold-Start Safety**: Collaborative filtering methods require extensive user transaction data (clicks, purchases, likes) before they can make accurate recommendations. A content-based approach works instantly for new products and new platforms with zero user history.
* **Low Computational Overhead**: Finding products in the same category is a fast $O(1)$ indexed query in MongoDB. This ensures load times for product pages remain extremely fast.
* **Semantic Relevance**: In premium interior design, items in the same collection category (e.g. matching lounge chairs or lighting) are highly relevant pairings, raising average order value (AOV) by presenting design-cohesive choices.

---

## 3. Future Scaling Roadmap

To scale the recommendation engine as transaction volumes grow:
1. **Hybrid Similarity Index**: Factor in shared tags, wood finishes, and price ranges to build a cosine similarity vector space.
2. **Collaborative Filtering (Matrix Factorization)**: Analyze checkout history using algorithms like Alternating Least Squares (ALS) to suggest items that *other customers frequently bought together*.
3. **Session-based Tracking**: Recommend recently browsed category items in a local cache strip.
