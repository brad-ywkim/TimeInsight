package kr.co.product.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.bid.model.dto.Bid;
import kr.co.product.model.dto.Expert;
import kr.co.product.model.dto.ExpertFile;
import kr.co.product.model.dto.Product;
import kr.co.product.model.dto.ProductFilter;
import kr.co.util.PageInfo;

@Mapper
public interface ProductDao {
	int totalCount(String selectedCategory);
	List selectProductList(ProductFilter pf);
	int selectTotalTime(String selectedCategory);
	int totalExpertCount();
	List selectExpertList(PageInfo pi);
	int insertExpert(Expert expert);
	int insertExpertFile(ExpertFile ef);
	Expert selectOneExpert(int expertNo);
	List selectOneExpertFileList(int expertNo);
	ExpertFile selectOneExpertFile(int expertFileNo);
	List<ExpertFile> selectExpertFile(int[] delFileNo);
	int deleteExpertFile(int[] delFileNo);
	int updateExpert(Expert expert);
	int insertProduct(Product product);
	Product selectProduct(int productNo);
	
	
	//테스트
	List<Integer> selectEndList();
	int updateProductState(List<Integer> endList);
	int updateEndProductState(Integer integer);
	int updateProductStateFour(Integer integer);
	int updateProductStateTwo(Integer integer);
	int updateProductStateFive(int productNo);
	int selectProductNo(Integer integer);
	int updateProductStateThree(int productNo);
	String selectDbTime();
	int totalProductCount();
	List<Product> selectAllProduct();
	int updateProduct(Product product);
	int cancleProduct(Product product);

	
	

}
