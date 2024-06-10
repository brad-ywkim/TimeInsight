package kr.co.product.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="expertFile")
public class ExpertFile {
	private int expertFileNo;
	private int expertNo;
	private String filename;
	private String filepath;
}
