package insis.acervo.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ConfigFile {

	private static Log LOGGER = LogFactory.getLog(ConfigFile.class.getName());
	private static final String PROPERTIES_FILE = "/conf/config.properties";

	Properties properties = new Properties();

	public ConfigFile() {
		InputStream input = null;
		try {
			Path currentRelativePath = Paths.get("");
			String absolutePath = currentRelativePath.toAbsolutePath().toString();
			LOGGER.info("Current relative path is: " + absolutePath);

			input = new FileInputStream(absolutePath + PROPERTIES_FILE);

			// save properties to project root folder
			this.properties.load(input);

			LOGGER.info("Properties: " + properties);

		} catch (IOException io) {
			io.printStackTrace();
			LOGGER.error(io.getMessage());

		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	public Properties getProperties() {
		return this.properties;
	}
}
