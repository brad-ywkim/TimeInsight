package kr.co.product.model.dto;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="expert")
@Schema(description = "전문가 객체")
public class Expert {
	private int expertNo;
	private int expertWriter;
	private String expertName;
	private String expertBirthday;
	private String expertJob;
	private String expertPhone;
	private String expertEmail;
	private String expertThumbnail;
	private String expertIntro;
	private List fileList;
	
	
	//전문가 수정용
	private int[] delFileNo;
	private int thumbnailCheck;
}
