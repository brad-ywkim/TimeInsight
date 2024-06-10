package kr.co;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import kr.co.product.model.dao.ProductDao;
import kr.co.product.model.service.ProductService;

//정해진 시간, 간격으로 메소드를 실행
@Component
public class Schedule {
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private ProductDao productDao;
	
	 //밀리초 단위 : 5000 -> 5초 간격
	//초, 분, 시, 일, 월, 요일, 년도
	@Scheduled(cron = "30 23 6 * * *") 
	public void test1() {
		Date javadate = new Date();
		String dbDate = productDao.selectDbTime();

		productService.productStateSchedule();
		
	}
	

}
